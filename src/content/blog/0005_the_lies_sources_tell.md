---
title: 'The lies your sources tell you'
date: '2025-12-22'
description: "A field guide to the assumptions that will eventually break your pipeline."
---

Every source system arrives with a set of assumptions handed to you by the team that owns it, and most of them are <span class="text-neutral" style="font-style:italic;">"true until they're not."</span> The lies aren't usually malicious -- they come from developers who built the application for a use case that didn't include data extraction, stakeholders who describe what *should* be true instead of what is, and systems that were designed when the data volume was a hundredth of what it is today. Your pipeline has to survive all of them anyway.

## "The schema is stable"

The most common lie, and the one with the longest tail. Columns get added because a developer needed a new field, renamed because a product manager decided `cust_flg` should be `is_customer`, and deleted because someone thought "nobody uses this." None of these come with a heads-up to the data team.

Two principles worth applying everywhere. First, use `SELECT *` at extraction, because you're cloning rather than reporting -- a `SELECT id, name, email, ...` query is a <span class="text-negative" style="font-weight:bold;">time bomb</span> the moment the source adds a column you're not listing. Second, snapshot the source schema on every run and diff it against the previous snapshot before any data moves:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'customers'
ORDER BY ordinal_position;
```

The diff dictates behavior. New columns get added to the destination and the run continues; columns that disappeared get treated as a hard failure (rename or deletion both look the same in `information_schema`, and you can't safely assume which one happened); no diff means proceed normally. BigQuery's schema auto-detection and Snowflake's `VARIANT` will absorb new columns automatically, but auto-detection can mistype a column with only `"1"`/`"0"` values as `BOOL`, and silent absorption means you won't notice when a rename creates two columns tracking the same concept.

## "`updated_at` is reliable"

`updated_at` is the most common cursor for incremental extraction and also the most commonly broken one. Three failure modes show up over and over again.

**It only fires on UPDATE, not INSERT.** New rows arrive with `updated_at = NULL` and an incremental filter of `WHERE updated_at > :last_run` misses every new row forever. The check is one query:

```sql
SELECT COUNT(*) AS missing_cursor
FROM orders
WHERE updated_at IS NULL;
```

Anything above zero means the cursor is already incomplete and you need a fallback before building anything else on top.

**It's set by the application, not the database.** The `UPDATE orders SET ..., updated_at = NOW()` pattern only fires when the application does the update, so a back-office script editing rows directly with `psql`, a database migration, or a developer fixing data by hand all bypass it entirely. Those rows change in the source and your pipeline never sees them.

**The index isn't there.** `updated_at` exists but nobody indexed it, so every incremental run is a full table scan on a transactional system under concurrent load. On a 50M-row table that's a multi-second query just to find the 200 rows that changed, and the DBA will eventually find you.

## "Primary keys are unique and stable"

Three lies bundled into one: the PK uniquely identifies a row, the PK stays stable across the row's lifetime, and every table even has a PK.

The most common version is that the business doesn't think in unicity terms. You ask "what's the primary key?" and get "order_id," but the table is actually keyed on `(order_id, line_number)` because the person you asked thinks about orders rather than how the table is structured. Verbal descriptions of the PK are <span class="text-negative" style="font-weight:bold;">never trustworthy</span> -- run the duplicate check yourself before committing:

```sql
SELECT id, COUNT(*) AS occurrences
FROM orders
GROUP BY id
HAVING COUNT(*) > 1
ORDER BY occurrences DESC
LIMIT 20;
```

If it returns rows, go back and ask which *combination* of columns is actually unique, then run the check again on that combination.

The other two lies are subtler. Recycled PKs happen when a row is deleted and the next insert reuses the integer ID, which means your destination has the old row's history attached to a completely different entity. PKs whose semantics changed are even quieter -- a multi-tenant migration adds `tenant_id`, uniqueness now requires `(tenant_id, order_id)`, the column names didn't change, and your pipeline keeps merging on `order_id` alone while silently colliding across tenants.

## "We don't do hard deletes / we use soft deletes"

Every system that <span class="text-neutral" style="font-style:italic;">"never does hard deletes"</span> does hard deletes. The application layer might soft-delete consistently, but the back-office script does a real `DELETE`, the developer debugging an issue deletes the bad rows directly, and the cleanup job that runs every Sunday night deletes pending records older than 90 days without telling anyone.

The classic from the domain model I've been using in the book is the rule that <span class="highlight">"only open invoices get hard-deleted."</span> Then someone runs a year-end cleanup and deletes a batch of incorrectly posted closed invoices, and your pipeline has them in the destination as closed-and-active forever. The discrepancy surfaces at audit time rather than load time, and it's your fault for not noticing.

Detection is simple in concept and almost always neglected in practice -- compare counts between source and destination on every run:

```sql
-- source
SELECT COUNT(*) FROM invoices;

-- destination
SELECT COUNT(*) FROM invoices WHERE _is_deleted = false;
```

If the source count is lower than the destination count, hard deletes happened. <span class="text-negative" style="font-weight:bold;">Cursor-based extraction is blind to this by design</span> because deleted rows have no `updated_at` -- they no longer exist to have one.

## "Timestamps have timezones"

The source uses `TIMESTAMP WITHOUT TIME ZONE` (PostgreSQL) or `DATETIME` (MySQL, SQL Server). The application "knows" it's UTC, but the column doesn't say so. Your pipeline reads `2026-03-06 14:00:00`, assumes UTC, and writes `2026-03-06 14:00:00 UTC` to BigQuery. Except the application was deployed in Santiago and the value was actually local time, which means the real UTC value was `2026-03-06 17:00:00` and every timestamp in your destination is off by three hours. Nobody notices because the *relative* order of events is correct and absolute times rarely get spot-checked.

The DST version is worse, because the offset changes twice a year and the error becomes <span class="text-negative" style="font-weight:bold;">inconsistent</span> -- some rows are off by 3 hours and others by 4 depending on when they were written.

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders';
```

| column_name | data_type                    |
|-------------|------------------------------|
| created_at  | timestamp without time zone  |
| updated_at  | timestamp without time zone  |

`timestamp without time zone` means the database is storing local time with <span class="text-negative" style="font-weight:bold;">no context</span> attached, which means you need to know the application's intended timezone before you can conform correctly. There's no way to infer it from the data itself.

## "The data is clean"

The most optimistic lie. Data is clean in demos, and in production it's a <span class="text-neutral" style="font-style:italic;">negotiation</span> -- orphaned foreign keys pointing at rows that no longer exist, duplicate "unique" values from columns the application keys on without enforcing in the database, constraint violations that nobody noticed because the application never validated them.

The right move in ECL is to <span class="text-positive" style="font-weight:bold;">faithfully clone</span> the source rather than fix the application's data quality problems. An orphaned FK in the source should land as an orphaned FK in the destination, because if you silently drop those rows downstream is missing data and doesn't know it. <span class="emphasis">Load it, flag it, let the business decide what to fix.</span>

---

The takeaway here isn't paranoia, it's that every assumption the source team hands you is <span class="text-negative" style="font-weight:bold;">a hypothesis</span> until verified, and the verification is almost always a single query you can run before writing any pipeline code at all. Ten minutes of checks beat six months of accumulated drift, every single time.

The next post is about the <span class="emphasis">purity vs. freshness</span> tradeoff, which is the decision every pipeline makes whether you realize it or not.
