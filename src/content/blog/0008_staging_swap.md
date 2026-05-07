---
title: 'Staging swap, or how to full-replace a live table without anyone noticing'
date: '2026-02-25'
description: "Load into staging, validate, swap atomically. Zero downtime, trivial rollback."
---

The naive full replace is `TRUNCATE production; INSERT INTO production SELECT * FROM source`. It works, it's simple, and it leaves a window where `production` is empty -- any dashboard or query that runs between the TRUNCATE and the INSERT sees nothing. On a table with live consumers, that window is <span class="text-negative" style="font-weight:bold;">an incident</span>.

The second problem is recovery. If the load fails halfway through, you're left with a half-loaded production table and no clean way back to the previous state without truncating again, which means another empty window. Staging swap eliminates both problems: consumers see complete data throughout, and rollback is dropping the staging table without ever touching production.

## The three-step pattern

The mechanics are conceptually simple and almost always implemented wrong on the first try.

**1. Load into staging.** Extract from the source and load entirely into a staging table. Production is untouched, and if the extraction or load fails at any point, nothing has happened to production.

**2. Validate.** Run checks against the staging table before touching production. At minimum: row count > 0, percentage change vs. production is within threshold, required columns have no NULLs on the merge key. These take seconds and protect against the failure mode where a silent extraction error replaces production with zero rows -- which is materially <span class="text-negative" style="font-weight:bold;">worse</span> than a failed load, because every consumer now sees empty data instead of stale data.

**3. Swap.** Atomically replace production with staging. The mechanism varies by engine, but the result is the same: one moment consumers are reading the old data, the next they're reading the new data, with no empty window in between.

## Where staging lives

Two conventions, each with real trade-offs.

|                       | Table prefix<br>`public.stg_orders`         | Parallel schema<br>`orders_staging.orders`          |
|-----------------------|---------------------------------------------|-----------------------------------------------------|
| Namespace             | Pollutes production schema                  | Clean separation                                    |
| Permissions           | Per-table grants                            | Schema-level grant / revoke                         |
| Cleanup               | Drop tables individually                    | `DROP SCHEMA ... CASCADE`                           |
| Swap complexity       | Simple -- rename within schema              | Harder -- cross-schema move or copy                 |
| Snowflake `SWAP WITH` | Works directly                              | Works across schemas                                |
| BigQuery              | `bq cp` or DDL rename within dataset        | `bq cp` only -- `RENAME TO` doesn't cross datasets  |
| PostgreSQL            | `RENAME TO` in transaction                  | `SET SCHEMA` + rename                               |

The parallel schema convention is worth it at scale, because permission management alone justifies it once you're running hundreds of tables. The trade-off is that the swap step gets more involved on PostgreSQL and Redshift, and you'll need engine-specific handling for it.

## The swap operation by engine

The swap must be atomic, so consumers never see a missing table. Each engine has its own mechanism.

**Snowflake** has the cleanest option of any engine -- a metadata-only swap, instant and truly atomic:

```sql
ALTER TABLE stg_orders SWAP WITH orders;
```

One caveat: grants don't carry over after a `SWAP`, because they follow the table name and not the data. Re-grant after every swap, or use `FUTURE GRANTS` on the schema.

**BigQuery** has no native SWAP. The recommended option for live tables is a copy job, which is free for same-region operations and atomic from the consumer's perspective:

```bash
bq cp --write_disposition=WRITE_TRUNCATE \
  project:dataset.stg_orders \
  project:dataset.orders
```

DDL rename is faster but introduces a brief unavailability window between steps, so it's only appropriate when you control a maintenance window.

**PostgreSQL / Redshift** can do the swap inside a transaction, which is atomic from the consumer's perspective:

```sql
BEGIN;
ALTER TABLE orders RENAME TO orders_old;
ALTER TABLE stg_orders RENAME TO orders;
DROP TABLE orders_old;
COMMIT;
```

If the transaction rolls back, `orders` is still the original, unchanged.

**ClickHouse** has `EXCHANGE TABLES`, which swaps both names atomically and leaves the previous production data sitting in `stg_orders` -- useful if you want to keep the previous version around for a period before dropping it:

```sql
EXCHANGE TABLES stg_orders AND orders;
```

## Validation before the swap

Never skip validation. The failure mode this pattern protects against is a silent extraction failure that replaces production with zero rows, which is the <span class="text-negative" style="font-weight:bold;">single worst outcome</span> for any data pipeline -- consumers see empty data and assume the business itself dropped to zero.

```sql
-- 1. Not empty
SELECT COUNT(*) AS row_count FROM stg_orders;
-- Fail if row_count = 0

-- 2. Within 10% of yesterday's production count
SELECT ABS(s.cnt - p.cnt) * 1.0 / p.cnt AS pct_change
FROM (SELECT COUNT(*) AS cnt FROM stg_orders) s,
     (SELECT COUNT(*) AS cnt FROM orders) p;
-- Fail if pct_change > 0.10

-- 3. No NULLs on merge key
SELECT COUNT(*) AS null_keys FROM stg_orders WHERE order_id IS NULL;
-- Fail if null_keys > 0
```

Most orchestrators let you wire these as post-load checks that gate the swap step. If any check fails, the job stops, staging is left intact for inspection, and production is untouched.

> Don't drop staging when validation fails -- it's the evidence of what went wrong, and you'll want it for debugging. Drop it only after the issue is resolved and the next successful run creates a fresh staging table.

## Rollback isn't a step

Worth saying explicitly: there is no rollback step in this pattern. If validation fails, you abort before the swap and production never changed. On the next run, staging is recreated from scratch -- it's a throwaway table, not state you carry forward. If the swap itself fails mid-operation (rare, but possible on non-atomic engines like BigQuery's DDL rename), check which table exists and which doesn't before deciding how to recover. On atomic engines (Snowflake `SWAP`, ClickHouse `EXCHANGE`, PostgreSQL transaction), a failure means the swap didn't happen and production is still the original.

The whole point of the pattern is that the only state you ever depend on is the production table, which is never touched until after every check has passed. Everything else is throwaway, and treating it that way is what makes the pattern reliable.

The next post is about <span class="emphasis">metadata column injection</span> -- the three columns I add to almost every extraction and what each one actually buys you.
