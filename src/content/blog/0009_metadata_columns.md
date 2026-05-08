---
title: 'The three metadata columns I add to every extraction'
date: '2026-03-14'
description: "_extracted_at, _batch_id, _source_hash — what each one costs and what it buys."
---

Metadata columns are just new columns added to the extraction query. Every destination supports them, columnar or transactional doesn't matter, and you're not changing what the data means -- you're <span class="text-positive" style="font-weight:bold;">tagging</span> each row with information about how and when it arrived.

There are three I reach for over and over, each with a different purpose and a different cost-benefit ratio. Not every table needs all three.

```sql
SELECT
    order_id,
    customer_id,
    status,
    total,
    updated_at,
    -- metadata columns
    CURRENT_TIMESTAMP                              AS _extracted_at,
    :batch_id                                      AS _batch_id,
    MD5(CONCAT(order_id, '|', status, '|', total)) AS _source_hash
FROM orders
WHERE updated_at >= :last_run;
```

## `_extracted_at`

The pipeline's timestamp -- when your extraction ran, not when the source row was last modified. A row updated three days ago and extracted today has `_extracted_at = today`, and that distinction matters because `updated_at` is the *source's* clock (maintained by application code, sometimes only on UPDATE, sometimes never on direct DB edits, sometimes NULL altogether), while `_extracted_at` is *your* clock -- set by your pipeline on every run, and always correct.

Always add this. The cost is trivial -- `CURRENT_TIMESTAMP` in the SELECT -- and the debugging value is enormous, because when something goes wrong (and it will), `_extracted_at` is how you answer "when did this bad data arrive?" and "which run brought it?"

`_extracted_at` is also the foundation for any append-and-materialize pattern. The `ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY _extracted_at DESC) = 1` view that gives you the latest version of each row depends entirely on this column having a reliable ordering. Without it, the dedup view has no ordering key and the pattern collapses.

> Use the same `_extracted_at` value for every table in the same pipeline run. If you extract `orders` and `order_lines` together, they should share a timestamp set once at the start of the run and passed to every extraction query, because that makes cross-table debugging trivially easier and prevents subtle ordering bugs when two tables in the same logical batch have slightly different timestamps.

## `_batch_id`

Correlates all rows from the same extraction run. Where `_extracted_at` tells you *when*, `_batch_id` tells you *which run* -- and the distinction matters when you have multiple runs sharing a timestamp (retries, overlapping schedules) or when you need to operate on an entire batch at once.

Three use cases earn the column. Rollback is the obvious one -- "batch 47 loaded bad data, delete everything from batch 47" is `DELETE WHERE _batch_id = 47` instead of reverse-engineering timestamp ranges and hoping you don't catch rows from adjacent runs. Debugging is the second -- "destination has 11,998 rows but the source had 12,000, which batch lost them?" becomes a single query against a `_batches` audit table. Reconciliation is the third -- when source-vs-destination row counts diverge, `_batch_id` is the join key that ties source-side logs to destination-side rows.

UUID or sequential integer, format doesn't matter -- consistency does. If your orchestrator already generates run IDs, reuse those instead of inventing parallel ones.

## The `_batches` table that goes with it

A lightweight metadata table on the destination that tracks each extraction run, with one row per (table, run):

```sql
CREATE TABLE _batches (
    batch_id         TEXT PRIMARY KEY,
    table_name       TEXT NOT NULL,
    extracted_at     TIMESTAMP NOT NULL,
    source_row_count INTEGER,
    dest_row_count   INTEGER,
    status           TEXT DEFAULT 'running',
    started_at       TIMESTAMP NOT NULL,
    completed_at     TIMESTAMP
);
```

The pipeline writes a row at the start of each run with `status = 'running'`, updates it after load with `status = 'completed'` and `dest_row_count` filled in, and marks it failed on error. This gives you a single place to answer "when did each table last load successfully?" and "which tables are loading right now?" -- questions that get <span class="text-negative" style="font-weight:bold;">surprisingly hard</span> to answer without it once you have more than a few dozen tables.

## `_source_hash`

A hash of the source row at extraction time. Enables hash-based change detection (compare hashes between runs to detect changes without trusting `updated_at`) and post-load reconciliation (compare source-side hash vs destination-side hash to verify the row arrived intact).

```sql
SELECT
    *,
    MD5(CONCAT(
        COALESCE(order_id::TEXT, '__NULL__'), '|',
        COALESCE(status,         '__NULL__'), '|',
        COALESCE(total::TEXT,    '__NULL__')
    )) AS _source_hash
FROM orders;
```

This one is <span class="text-negative" style="font-weight:bold;">expensive at scale</span>. Hashing every row adds compute on the source or in the pipeline, and at ~800 tables that can add 20 minutes to an already tight extraction window. The cost is roughly proportional to row count × column count, so wide tables with millions of rows are where it really hurts.

The right approach is tiered. High-value mutable tables where change detection matters and `updated_at` is unreliable (`invoices`, `orders`) earn the column. Stable config tables that change once a quarter, and append-only tables like `events` where you never need to detect mutations, skip it. Most pipelines I've built end up adding `_source_hash` to maybe 15-20% of tables.

Two implementation gotchas worth knowing. Most hash functions return NULL if any input is NULL, which means a row with a single NULL column produces a NULL hash -- indistinguishable from every other row with a NULL in the same position. `COALESCE(col, '__NULL__')` before concatenation prevents this. And exclude `_extracted_at` and `_batch_id` from the hash input itself, because those change every run by design and including them defeats the entire purpose.

## Where to compute them

Every metadata column runs *somewhere* -- in the source query, in Python between extraction and load, or in a staging transform on the destination -- and the choice depends on what the source can handle and how much compute you're willing to add to the extraction.

| Where                  | Best for                | Trade-off                                     |
|------------------------|-------------------------|-----------------------------------------------|
| Source query           | `_extracted_at`, `_batch_id` | Free on every engine; compute lives at source |
| Orchestrator / Python  | `_source_hash` if cross-engine | Consistent hashing but extra data hop  |
| Destination staging    | When extraction has to be minimal | Offloads compute to destination compute |

For `_extracted_at` and `_batch_id`, the source query is almost always right -- the cost is negligible and the data is correct from the moment it's extracted. For `_source_hash`, the source query and Python are both reasonable depending on whether your source has a convenient hash function and whether you can spend the compute on the source side.

---

Three columns, three different cost profiles, three different roles. The default I'd recommend for any new pipeline: <span class="text-positive" style="font-weight:bold;">always</span> `_extracted_at`, <span class="text-positive" style="font-weight:bold;">always</span> `_batch_id`, and `_source_hash` only on the tables that actually need it. The first two cost nothing and pay for themselves the first time something breaks; the third is a real expense and should be applied where it earns its keep.

The wider lesson is that <span class="emphasis">your pipeline knows things the source doesn't</span> -- when it ran, which run a row belongs to, what the row looked like at extraction time -- and writing those things into the destination as columns is the cheapest observability investment you'll ever make. They're three lines in a SELECT statement and they turn six-hour debugging sessions into single queries. There is no version of an ECL pipeline I'd build today that doesn't include at least the first two.
