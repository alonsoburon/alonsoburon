---
title: 'Incremental ingestion cheat-sheet - Guide for batch ingestion with real (ugly) data'
date: '2025-10-26'
description: 'Multiple examples of incremental loading rules for different cases'
---

Whenever you're working on batch ingestion with real data, you'll find some <span class="text-negative" style="font-weight:bold;">massive datasets</span> that you can't afford to load all at once.

In order to avoid that you'll use <span class="text-positive" style="font-weight:bold;">incremental loading</span>, which I think is pretty simple to set up if the origin table has all the data you need. If it doesn't, you'll have to start <span class="text-neutral" style="font-style:italic;">making stuff up</span>.

Here's a <span class="highlight">quick reference guide</span> for incremental loading, with multiple examples for different cases.

## Note on loading after extraction:

For all the examples below, I'll assume that you'll be de-duplicating data and merging using Upsert or Insert-delete logics, unless otherwise specified.

An example of this would be ingesting the result of the extraction step into a staging table, then merging it into the target table.

Here's an example of upsert logic inspired by DLT-Hub's [incremental loading](https://dlthub.com/docs/general-usage/incremental/cursor) documentation.

```sql
-- Deduplicate staging first (keeping latest for each id by updated_at)
WITH deduped_staging AS (
  SELECT
    s.*,
    ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.updated_at DESC) as rn
  FROM staging_table s
)
MERGE INTO target_table t
USING (
  SELECT * FROM deduped_staging WHERE rn = 1
) s
ON t.id = s.id
WHEN MATCHED THEN 
  UPDATE SET
    t.client_id = s.client_id,
    t.quantity = s.quantity,
    t.updated_at = s.updated_at,
    t.is_deleted = s.is_deleted
WHEN NOT MATCHED THEN
  INSERT (id, client_id, quantity, updated_at, is_deleted)
  VALUES (s.id, s.client_id, s.quantity, s.updated_at, s.is_deleted);
```


## Case 1: Simple Primary Key, Cursor column, No hard deletes.

Here's the <span class="text-positive" style="font-weight:bold;">ideal data structure</span> for an incrementally loaded table:

| id (PK) | client_id |  quantity | updated_at (cursor) | is_deleted |
|---|---|---|---|---|
| 1| 1| 5| 2025-10-01 11:32:03 | false |
| 2| 1| 6| 2025-10-22 12:47:13 | false |
| 3| 2| 8| 2025-10-22 11:23:00 | false |
| 4| 2| 10| 2025-10-23 10:45:00 | true |
| 5| 3| 12| 2025-10-24 09:12:00 | false |

For these type of tables, your extraction step is pretty simple:

```sql
SELECT *
FROM table_name
WHERE updated_at >= TIMESTAMP_SUB(
  CURRENT_TIMESTAMP(),
  INTERVAL {lag_days} DAY
)
```

> This allows you to gather the last `n` days of data, where `n` could represent the lag (for catching late updates) or a big enough number to backfill a specific period.

**HOWEVER**, this assumes that the <span class="text-negative" style="font-weight:bold;">updated_at column is NOT NULL</span>, which is not always the case. And that **every** update or change to the table is reflected in the updated_at column.

I've had cases when you have something like this:

| id (PK) | client_id |  quantity | updated_at | created_at | is_deleted |
|---|---|---|---|---|---|
| 1| 1| 5| 2025-10-01 11:32:03 | 2025-10-01 11:32:03 | false |
| 2| 1| 6| 2025-10-22 12:47:13 | 2025-10-22 12:47:13 | false |
| 3| 2| 8| | 2025-10-22 11:23:00 | false |
| 4| 2| 10| 2025-10-23 10:45:00 | 2025-10-23 10:45:00 | true |
| 5| 3| 12| 2025-10-24 09:12:00 | 2025-10-24 09:12:00 | false |

In this case, you can't use the updated_at column to determine if a row has been updated. I recommend bringing the latest of the updated_at and created_at columns to determine the latest update.

In most SQL dialects, you can use GREATEST() to get the latest of the updated_at and created_at columns, but for the most dialect-agnostic approach, we can use a CASE statement to get the latest of the two columns.

```sql
SELECT *
-- Optionally add the cursor column to the select
-- , CASE
--     WHEN updated_at > created_at THEN updated_at 
--     ELSE created_at 
--   END as _cursor
FROM table_name
WHERE CASE 
  WHEN updated_at > created_at THEN updated_at 
  ELSE created_at 
END >= (
  TIMESTAMP_SUB(CURRENT_TIMESTAMP(),
  INTERVAL {lag_days} DAY)
)
```

> This will return all the rows that have been updated OR created since the last `n` days. This allows you to use either the updated_at or created_at column to determine the latest update. This can help in cases when a Create operation does not automatically fill the updated_at column.

## Case 2: Simple Primary Key, Cursor column, Hard deletes.

There's a <span class="text-negative" style="font-weight:bold;">big enemy</span> in sight though. Once the source table has <span class="emphasis">hard deletes</span>, you'll have to start changing your extraction logic to handle them. Here's the multiple ways to handle this:

| id | client_id |  quantity | updated_at |
|---|---|---|---|
| 1| 1| 5| 2025-10-01 11:32:03 |
| 2| 1| 6| 2025-10-22 12:47:13 |
| 3| 2| 8| 2025-10-22 11:23:00 |
| 4| 2| 10| 2025-10-23 10:45:00 |
| 5| 3| 12| 2025-10-24 09:12:00 |

Say you had this table, and then you deleted record id=2.
You can't just get the deleted rows using any 'where' clauses, since there's no record with id=2 anymore.

### Option 1: Re-load the full dataset once in a while

In order to identify this, the <span class="text-neutral" style="font-style:italic;">naive approach</span> would be to simply re-load the full dataset once in a while (say, once a week).

```sql
SELECT *
FROM table_name
```

Then replace your load step with a full replace:
```sql
BEGIN;

TRUNCATE TABLE target_table;

INSERT INTO target_table (id, client_id, quantity, updated_at, is_deleted)
SELECT id, client_id, quantity, updated_at, is_deleted
FROM staging_table;

COMMIT;
```

> This is a simple and effective way to handle hard deletes. It's not the most efficient, but it's the most straightforward. It's also pretty expensive if the dataset is large, but it can handle ANY weird cases you didn't handle properly in the extraction step.

### Option 2: Use id scanning to identify deleted rows

For a <span class="text-positive" style="font-weight:bold;">more efficient approach</span>, you can use id scanning to identify deleted rows, you'll have to read all the ids from both tables, but it's a <span class="text-positive" style="font-weight:bold;">hell of a lot cheaper</span> than reading every column, especially in columnar databases.

In the extraction step, you'll have to get all the ids from the source table:
```sql
SELECT id
FROM source_table
```

Then in the load step, you'll have to identify the deleted rows by comparing the ids from the source table with the ids from the target table:
```sql
SELECT s.id
FROM staging_table s
LEFT JOIN target_table t ON s.id = t.id
WHERE t.id IS NULL
```

Once you've identified which ids are present in the target table but missing from the latest source data, you can either delete those rows from the target table or, preferably, mark them with an is_deleted flag for better tracking and consistency.

```sql
BEGIN;

UPDATE target_table
SET is_deleted = TRUE
WHERE id IN (SELECT id FROM deleted_ids);

COMMIT;
```

> This is a more efficient approach than the full replace, but it's still a pretty expensive operation, especially when there have been no deletes, you're scanning a lot of ids for no reason.

### Option 3: Compare counts in order to trigger the id-scanning

In my opinion, this is the <span class="text-positive" style="font-weight:bold;">most efficient approach</span>. First, you'll get the counts from both tables (excluding rows marked as deleted in the target):

```sql
SELECT COUNT(*) FROM source_table;
```

```sql
SELECT COUNT(*) FROM target_table WHERE is_deleted = FALSE;
```

After fetching these values, compare the counts in your application code or ETL orchestration tool. Only if the source table count is less than the target table count should you proceed with the (expensive) id-scanning step. For example (in pseudo-code):

```python
# Get counts from each table
source_count = ... # result of SELECT COUNT(*) FROM source_table
target_count = ... # result of SELECT COUNT(*) FROM target_table WHERE is_deleted = FALSE

if source_count < target_count:
    # Trigger id-scanning SQL below
    # Find ids to mark as deleted, then update
    # (same as Option 2)
else:
    # No action needed; no deletions detected
    pass
```

This way, you avoid unnecessary scans and only perform the expensive operation when an actual delete may have occurred.

> The reason for only doing this with source_count < target_count is because if the source table has more rows than the target table, it means there are new rows that need to be inserted, which probably means another incremental load is needed.

For this reason, the count comparison should be done immediately after the extraction step, so you can be sure that the counts are accurate.

## Case 3: Composite Primary Key

For completeness, here's an example of a composite primary key:

| document_id (PK) | row_id (PK) | client_id |  quantity | updated_at |
|---|---|---|---|---|
| 1| 1| 1| 5| 2025-10-01 11:32:03 |
| 1| 2| 1| 6| 2025-10-22 12:47:13 |
| 3| 1| 2| 8| 2025-10-22 11:23:00 |
| 3| 2| 2| 10| 2025-10-23 10:45:00 |
| 5| 1| 3| 12| 2025-10-24 09:12:00 |

The only difference here is that you'll have to use the document_id and row_id columns to identify the rows to be deleted.

```sql
SELECT document_id, row_id
FROM source_table
```

Then in the load step, you'll have to identify the deleted rows by comparing the document_id and row_id from the source table with the document_id and row_id from the target table:
```sql
SELECT s.document_id, s.row_id
FROM staging_table s
LEFT JOIN target_table t ON s.document_id = t.document_id AND s.row_id = t.row_id
WHERE t.document_id IS NULL OR t.row_id IS NULL
```

## Case 4: Cursor column is in a different table

Here's a classic case for compounded tables. Let's say you have a table called 'orders' that looks like this:

| order_id (PK) | client_id |  quantity | updated_at |
|---|---|---|---|
| 1| 1| 5| 2025-10-01 11:32:03 |
| 2| 2| 6| 2025-10-22 12:47:13 |

And you have a table called 'order_lines' that looks like this:
| order_id (PK + FK) | order_line_id (PK) | client_id |  quantity |
|---|---|---|---|
| 1| 1| 1| 5|
| 1| 2| 1| 6|
| 2| 1| 2| 8|
| 2| 2| 2| 10|

In this case, you'll have to use a join to get the latest updated_at for each order_id. And then fill the lines table with the updated_at from the orders table.

This is called a 'foreign cursor', here's how you can handle it:

```sql
SELECT
  ol.*,
  o.updated_at as _cursor
FROM orders o
LEFT JOIN order_lines ol ON o.order_id = ol.order_id
WHERE o.updated_at >= TIMESTAMP_SUB(
  CURRENT_TIMESTAMP(),
  INTERVAL {lag_days} DAY
)
```

I recommend storing the cursor in the order_lines table, to simplify incremental handling for your clients down the stack.

> This can of course be combined with the other cases, multiple cursors, multiple keys, etc.

## Case 4: State tables

Like an <span class="text-neutral" style="font-style:italic;">ouroboros</span>, sometimes the business logic requires some tables that store data and delete data constantly. For example, an <span class="text-neutral" style="font-weight:bold;">"incoming payments"</span> table that stores payments that are still pending, and then deletes them once they're processed. Or a <span class="text-neutral" style="font-weight:bold;">"pending invoices"</span> table that stores invoices that are still pending, and then deletes them once they're paid.

Here's an example of a state table:

| id (PK) | client_id | owed_amount | updated_at |
|---|---|---|---|
| 1| 1| $100| 2025-10-01 11:32:03 |
| 2| 2| $200| 2025-10-22 12:47:13 |
| 3| 3| $300| 2025-10-23 10:45:00 |

These tables tend to <span class="text-positive" style="font-weight:bold;">rotate data very quickly</span>, deleting all its rows and replacing them with new ones a lot more often than the other tables.

For these cases, you'll honestly have an <span class="text-positive" style="font-weight:bold;">easier (and less expensive)</span> time just re-loading the full table constantly, and not trying to be smart about it.

```sql
BEGIN;

TRUNCATE TABLE target_table;

INSERT INTO target_table (id, client_id, owed_amount, updated_at)
SELECT id, client_id, owed_amount, updated_at
FROM staging_table;

COMMIT;
```

> These type of tables tend to not grow very big, so the full replace is not that expensive.

## Final Boss: Composite Keys + Foreign Cursors + Hard Deletes

Now let's combine this <span class="text-negative" style="font-weight:bold;">whole mess</span> into a single tough example. This is the kind of scenario that will make you <span class="text-negative" style="font-style:italic;">question your career choices</span>.

Say you have an `invoice_lines` table that looks like this:

| invoice_id (PK) | line_id (PK) | client_id |  quantity |
|---|---|---|---|
| 1| 1| 1| 5|
| 1| 2| 1| 6|
| 2| 1| 2| 8|
| 2| 2| 2| 10|

And an `invoices` table that looks like this:

| invoice_id (PK) | client_id |  total_amount | updated_at |
|---|---|---|---|
| 1| 1| $100| 2025-10-01 11:32:03 |
| 2| 2| $200| 2025-10-22 12:47:13 |

Here's where it gets <span class="text-negative" style="font-weight:bold;">messy</span>. You need to handle <span class="emphasis">three different problems</span> at once:

1. **<span class="text-negative" style="font-weight:bold;">Foreign Cursor</span>**: The `invoice_lines` table doesn't have its own `updated_at` column, so you need to use the cursor from the `invoices` table
2. **<span class="text-negative" style="font-weight:bold;">Composite Primary Key</span>**: The `invoice_lines` table uses `(invoice_id, line_id)` as a composite key
3. **<span class="text-negative" style="font-weight:bold;">Hard Deletes</span>**: When invoice lines are deleted from the source, they're completely removed (no soft delete flag)

This is pretty common in e-commerce or ERP systems where line items are managed separately from their parent records.

### Step 1: Extraction with Foreign Cursor

For the extraction step, you'll need to use a `LEFT JOIN` to get all invoice lines for invoices that have been updated recently. The trick here is that you're using the `invoices.updated_at` as your cursor, not the `invoice_lines` table:

```sql
SELECT
  il.*,
  i.updated_at as _cursor
FROM invoices i
LEFT JOIN invoice_lines il ON i.invoice_id = il.invoice_id
WHERE i.updated_at >= TIMESTAMP_SUB(
  CURRENT_TIMESTAMP(),
  INTERVAL {lag_days} DAY
)
```

This works because:
- You start with the `invoices` table (which has the cursor column)
- You `LEFT JOIN` to get all related invoice lines
- This captures both new invoice lines AND existing lines from recently updated invoices
- The `_cursor` field comes from the parent invoice, not the line item

### Step 2: UPSERT with Composite Key

After extraction, you'll load into the target table using the UPSERT logic. The key thing here is how you handle the composite key in the `ON` clause:

```sql
BEGIN;

MERGE INTO target_table t
USING (
  SELECT * FROM staging_table
) s
ON t.invoice_id = s.invoice_id AND t.line_id = s.line_id
WHEN MATCHED THEN
  UPDATE SET
    t.client_id = s.client_id,
    t.quantity = s.quantity,
    t.updated_at = s.updated_at
WHEN NOT MATCHED THEN
  INSERT (invoice_id, line_id, client_id, quantity, updated_at)
  VALUES (s.invoice_id, s.line_id, s.client_id, s.quantity, s.updated_at);
COMMIT;
```

The important part is that the `ON` clause uses **both** `invoice_id` AND `line_id` to match records. This ensures you're updating the exact right line item, not just any line from the same invoice. The `MERGE` will handle both updates to existing lines and inserts of new lines.

### Step 3: Detect Hard Deletes

Since the source system uses hard deletes (records are completely removed), you can't rely on the incremental extraction to tell you what was deleted. Instead, you'll need to use a count-based detection strategy.

First, get the total count from the source:
```sql
SELECT COUNT(*) FROM source_table;
```

Then, get the count of active records in your target:
```sql
SELECT COUNT(*) FROM target_table WHERE is_deleted = FALSE;
```

If the source count is less than the target count, it means some records were hard-deleted from the source and you need to find and mark them as deleted in your target.

### Step 4: Handle Hard Deletes with Composite Keys

This is where it gets tricky. You need to find the specific records that were deleted and mark them as `is_deleted = TRUE`. The challenge is doing this efficiently with composite keys.

In your application code or ETL orchestration tool:

```python
source_count = ... # result of SELECT COUNT(*) FROM source_table
target_count = ... # result of SELECT COUNT(*) FROM target_table WHERE is_deleted = FALSE

if source_count < target_count:
  # Get all composite keys from source (what currently exists)
  source_ids = set(
    sql.execute(
      "SELECT invoice_id, line_id FROM source_table"
    ).fetchall()
  )
    
  # Get all composite keys from target (what we think should exist)
  target_ids = set(
    sql.execute(
      "SELECT invoice_id, line_id FROM target_table WHERE is_deleted = FALSE"
    ).fetchall()
  )
    
  # Find the difference: records that exist in target but not in source
  deleted_ids = target_ids - source_ids

  if deleted_ids:
    # Create proper WHERE clause for composite key
    # This is the critical part - we need to match BOTH invoice_id AND line_id
    where_conditions = []
    for invoice_id, line_id in deleted_ids:
      where_conditions.append(
        f"(invoice_id = {invoice_id} AND line_id = {line_id})"
      )

    where_clause = " OR ".join(where_conditions)
    sql.execute(f"""
      UPDATE target_table
      SET is_deleted = TRUE
      WHERE {where_clause}
    """)
  else:
    pass
```

### Why This Approach Works

The tricky part with composite keys is that you can't just use `IN` clauses for each column separately. That would create a Cartesian product and mark the wrong records as deleted.

For example, if you had:
```sql
WHERE invoice_id IN (1, 2) AND line_id IN (1, 2)
```

This would mark ALL combinations as deleted: `(1,1)`, `(1,2)`, `(2,1)`, and `(2,2)`. But you only want to mark the specific ones that were actually deleted.

The solution is to treat each `(invoice_id, line_id)` tuple as a single unit and create specific `WHERE` conditions for each deleted record.

If records `(1,2)` and `(2,1)` were deleted, you create:
```sql
WHERE (invoice_id = 1 AND line_id = 2) OR (invoice_id = 2 AND line_id = 1)
```

This ensures you only mark the exact records that were deleted, not all combinations of those IDs.

### Performance Considerations

- Count comparison is fast and tells you if you need to do the expensive ID scanning. However, you could also use metadata-scanning for counts, which is even faster.
- Set operations in Python are efficient for finding differences.
- Batch updates with `OR` conditions are more efficient than individual updates.
- Index on composite key `(invoice_id, line_id)` is essential for performance.

The use of these patterns handles most of the complex incremental loading scenarios you'll encounter in real-world data engineering.

---

## Wrapping Up

Incremental loading isn't just about writing a simple `WHERE` clause with a timestamp. It's about understanding your data and having a plan for when things go wrong.

Start simple, work your way up. When in doubt, full reload. It's not elegant, but it fixes any unaccounted-for edge cases.

These patterns will save you from the <span class="text-negative" style="font-weight:bold;">data chaos</span> that turns simple incremental loads into debugging nightmares.
