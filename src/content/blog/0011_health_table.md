---
title: 'The health table, the one piece of infrastructure I would build first'
date: '2026-04-18'
description: "One row per table per run, raw measurements only. Everything else is a query on top."
---

If I were starting a pipeline from scratch today, before I wrote any extraction logic at all, I'd build the health table. It's a single append-only table that captures raw measurements from every pipeline run, and it gives you a queryable history of everything your orchestrator doesn't track natively. Without it, monitoring lives in scattered logs, orchestrator UIs, and tribal knowledge -- none of which you can `SELECT` from at 7 AM when something is wrong.

This post is the schema, the columns I think are worth the storage cost, and the discipline required to keep it useful.

## The schema

Not every column is equally important, and the schema below is ordered by criticality. The last group is optional depending on how much storage cost you're willing to absorb.

```sql
-- One row per table per pipeline run. Append-only.
CREATE TABLE health.runs (
  -- Identity (always needed)
  extracted_at          TIMESTAMP,
  client                STRING,
  table_id              STRING, -- include source identifier, not just table name
  run_id                STRING, -- links back to the orchestrator run

  -- Critical (the metrics you check every morning)
  status                STRING, -- SUCCESS, FAILED, WARNING
  error_message         STRING, -- raw error on failure, NULL on success
  source_rows           INT64,  -- counted at the source before extraction
  destination_rows      INT64,  -- counted at the destination after load
  rows_extracted        INT64,  -- rows the extraction query returned

  -- Important (where the time goes)
  extraction_seconds    FLOAT64,
  normalization_seconds FLOAT64,
  load_seconds          FLOAT64,
  extraction_strategy   STRING, -- full_replace, incremental, window, etc.

  -- Nice to have (debug-heavy, costlier to store)
  bytes_extracted       INT64,
  query_used            STRING,
  schema_json           STRING
);
```

The guiding principle is <span class="text-positive" style="font-weight:bold;">store raw measurements, derive the rest at query time</span>. Discrepancy percentages, per-row extraction time, average row size, throughput -- all computable from the columns above and don't need their own storage. A view or a dashboard query handles them, and the underlying table stays narrow and additive over time.

## What the critical columns actually buy you

`status` and `error_message` together tell you what failed and why without leaving the health table. Without `error_message`, "12 tables failed overnight" sends you digging through orchestrator logs, job UIs, and possibly multiple systems to find out why each one broke -- with it, you can triage severity from a single query, because a connection timeout is meaningfully different from a schema mismatch and you want to know which you're dealing with before investigating.

The subtler case is `status = 'SUCCESS'` with `rows_extracted = 0`. Normal when an incremental cursor is caught up. Alarming when the source table was silently dropped or permissions changed. Without the strategy column to tell them apart, the two scenarios look identical in your health table.

The three row counts (`source_rows`, `rows_extracted`, `destination_rows`) are how you do per-run reconciliation, and the meaningful comparison depends on the strategy. On a full replace, `rows_extracted` should equal `destination_rows` -- you pulled N, loaded N, the destination has N. If they diverge, the load lost or duplicated data. `source_rows` may differ slightly from `rows_extracted` because the source can receive writes between the count and the extraction (transit-time noise, typically under 0.1% on a busy table), so set your alert thresholds above this floor to avoid false positives on every run.

On an incremental, the per-run check is less direct, because `rows_extracted` is a window of change rather than the full table and won't match `destination_rows`. Track `source_rows` vs `destination_rows` <span class="emphasis">across runs</span> instead -- if the totals drift apart over time, the incremental is accumulating missed rows or undetected deletes, and a full replace is overdue.

## Important columns

The timing breakdown stays as three separate columns because a single `total_seconds` hides whether the bottleneck is the source query, the conforming step (type casting, metadata injection, all the per-row work that happens between extraction and load), or the destination load itself. When a pipeline that used to take 5 minutes starts taking 40, you need to know which phase is degrading without digging into logs -- and the total is trivially computable from the parts while the parts are not recoverable from the total.

`extraction_strategy` records whether this run was `full_replace`, `incremental`, `window`, or something else. The same table can run different strategies on different schedules (a nightly full replace for purity, intraday incremental for freshness), and without this column 50k `rows_extracted` is ambiguous -- perfectly normal on a full replace, possibly alarming on an incremental that usually returns 2k.

## Nice-to-have columns and their cost

`bytes_extracted` is cheap to store and catches a failure mode that row counts miss entirely: rows getting wider. If `rows_extracted` stays flat but `bytes_extracted` climbs, the source is gaining columns or existing text columns are growing, both of which affect extraction time, network transfer, and destination storage. Keep this one -- the cost is negligible.

`query_used` stores the actual extraction query, which implicitly records the cursor value, window boundaries, and any filters applied. When an incremental returns 0 rows, the query tells you whether the cursor was already caught up or stuck. When a full replace suddenly takes 10x longer, the query tells you if someone added a `WHERE` clause that forced a full scan at source. It's the <span class="text-positive" style="font-weight:bold;">single most useful debugging column</span> -- and the most expensive to store. At thousands of tables running 3x daily, with each `query_used` averaging 2KB, that column alone is roughly 14GB/year before compression. Worth it for debugging, but if cost is tight, store it in a separate detail table keyed by `run_id` and only join when you need it.

`schema_json` is a JSON snapshot of column names and types from this run. Comparing to the previous snapshot detects schema drift without building a separate fingerprinting system, but the storage profile is similar to `query_used`, so the same trade-off applies.

## The derived view that pays for the table

None of the useful metrics need their own column -- build them as a view on top:

```sql
CREATE VIEW health.runs_derived AS
SELECT
  *,
  extraction_seconds + normalization_seconds + load_seconds AS total_seconds,
  SAFE_DIVIDE(rows_extracted - destination_rows, rows_extracted) * 100 AS load_loss_pct,
  SAFE_DIVIDE(source_rows - destination_rows, source_rows)     * 100 AS drift_pct,
  SAFE_DIVIDE(rows_extracted, extraction_seconds)              AS rows_per_second,
  SAFE_DIVIDE(bytes_extracted, rows_extracted)                 AS avg_row_bytes
FROM health.runs;
```

`rows_per_second` is the early warning for source degradation. On incremental tables it should be roughly stable across runs, so a drop by half means the source query is getting slower per row -- possibly because the cursor column lost its index or the table's physical layout changed. A drop in `rows_per_second` with stable `rows_extracted` points at the source; stable `rows_per_second` with a spike in `rows_extracted` points at a data event. The two scenarios need very different responses, and one query separates them.

## The discipline part

The schema is the easy part. The discipline is harder, because every run -- successful or not -- has to append a row, and a missing row in the health table is <span class="text-negative" style="font-weight:bold;">indistinguishable</span> from "the pipeline didn't run" when you're triaging at 7 AM. That ambiguity is worse than a recorded failure.

```sql
INSERT INTO health.runs (
  extracted_at, client, table_id, run_id,
  status, error_message,
  source_rows, rows_extracted, destination_rows,
  extraction_seconds, normalization_seconds, load_seconds,
  extraction_strategy
) VALUES (
  CURRENT_TIMESTAMP(), @client, @table_id, @run_id,
  @status, @error_message,
  @source_rows, @rows_extracted, @destination_rows,
  @extraction_seconds, @normalization_seconds, @load_seconds,
  @extraction_strategy
);
```

On failure, `rows_extracted` and `destination_rows` will likely be NULL, and that's expected -- the row still captures `status = 'FAILED'`, the error message, and whatever timing was available before the failure. NULL in `destination_rows` on a FAILED row means the load never completed, which is meaningfully different from zero (the load ran but produced nothing). Both are worth recording and both tell you something different during triage.

> Counting source rows without punishing the source: `SELECT COUNT(*)` on a 50M-row transactional table can lock pages and spike CPU. For drift detection, an approximate count from the database's statistics catalog is often good enough -- `pg_stat_user_tables.n_live_tup` in PostgreSQL, `information_schema.TABLES.TABLE_ROWS` in MySQL. You're watching for 10%+ swings, not exact matches.

The health INSERT itself can fail (destination timeout, permission issue, quota exhaustion) and silently leave a gap in your monitoring. Wrap it in its own error handler with a fallback to local logging -- a JSON file, a stderr line, anything durable -- so you at least know the health write failed even if the row didn't land. Discovering that your monitoring table has a 3-day gap because the health destination was unreachable is a particularly frustrating way to learn you had no visibility during an incident.

The whole thing is about 50 lines of schema, an INSERT in a `finally` block, and one view. It costs almost nothing to add and pays for itself the first morning something quietly went wrong overnight and you were the one who had to figure out why. <span class="text-positive" style="font-weight:bold;">Build it before you need it</span> -- by the time you need it, the data you wish you'd captured is already gone.
