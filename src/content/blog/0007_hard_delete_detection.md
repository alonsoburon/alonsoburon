---
title: 'Hard delete detection, the case every cursor misses'
date: '2026-02-03'
description: "The row was there yesterday and gone today. A cursor never sees it, so something else has to."
---

Every incremental extraction pattern -- cursor-based, stateless windows, borrowed timestamps -- detects rows that *changed*. A hard delete leaves nothing behind to detect, because the row is gone from the source, still present in the destination, and every cursor-based run confirms <span class="text-negative" style="font-weight:bold;">absolutely nothing</span> about its absence. `WHERE updated_at > :last_run` returns zero rows for that ID. The destination keeps it. The count drifts silently, and you discover the problem at audit time -- if you're lucky enough to have an audit.

This post is the menu of mechanisms for catching deletes from the outside, in the order you should reach for them.

## When the source cooperates

Two source-side mechanisms make delete detection trivial when they exist, which they often don't.

**Soft-delete columns** like `is_active` or `deleted_at` mark the row as deleted instead of removing it, so the normal cursor captures the flag change like any other update. This is the clean solution and rarer than you'd expect -- most transactional systems, especially ERPs, hard-delete without ceremony.

**Tombstone tables** record a separate audit row in a `deletes` or `audit_log` table when something gets removed. Extract from both the main table and the tombstone table, and the tombstone tells you what's gone. Common in CDC-adjacent setups, rare in plain application databases.

When neither exists, the detection has to happen from the outside, and the menu narrows to two options.

## Full ID comparison

Pull the full set of IDs from the source, pull the full set of IDs from the destination, compare them. The diff is everything that exists in the destination but no longer in the source -- candidates for deletion.

```sql
-- destination, after landing source IDs into a staging table
SELECT d.invoice_id
FROM invoices d
LEFT JOIN _stg_invoice_ids s ON d.invoice_id = s.invoice_id
WHERE s.invoice_id IS NULL;
```

The expensive part is the source side, because `SELECT id FROM table` on a large transactional table still hits every row -- but only one column, so it's a fraction of the cost of a full extraction. Schedule it outside business hours when possible. The destination side is cheap on any columnar engine, since scanning a single key column is what they're built for.

For small-to-medium tables this is the simplest and most reliable approach. For large tables, run count reconciliation as a cheaper first pass and only fall back to ID comparison when the counts diverge.

## Count reconciliation

Compare `COUNT(*)` between source and destination. If counts match, no deletes happened (or inserts and deletes balanced out, which is rare but possible). If they diverge, something changed.

```sql
-- source
SELECT COUNT(*) FROM invoices;

-- destination
SELECT COUNT(*) FROM invoices;
```

This detects drift cheaply but doesn't tell you which rows are involved. Two reasonable responses depending on table size: trigger a full replace on divergence (simple, correct, and often the cheapest fix for moderate tables), or trigger a full ID comparison only on divergence (use the count mismatch as a gate for the heavier detection).

The direction of the mismatch tells you something useful. If destination > source, deletes happened at the source since the last full sync. If destination < source, inserts landed that the extraction missed -- a cursor gap, late-arriving data, or simple delay between extraction and loading. For partitioned tables, comparing counts per partition narrows the scope before you commit to an ID comparison on the whole table.

> Run `COUNT(*)` reconciliation on every incremental as a <span class="text-positive" style="font-weight:bold;">cheap health check</span>. It adds seconds to the run and catches drift before it accumulates into a reconciliation problem at audit time.

## What to do with the deleted IDs

Once you've identified them, three options for propagation -- in order of preference for most setups.

**Soft-delete in the destination.** Set `_is_deleted = true` and `_deleted_at = CURRENT_TIMESTAMP`. The row stays queryable, downstream consumers can filter on the flag, and the delete is reversible if the source was wrong. If your downstream is technical (analysts, dbt models that know to filter), this is the default.

**Hard-delete in the destination.** `DELETE FROM destination WHERE id IN (...)`. Matches the source exactly. Simpler for non-technical consumers who don't understand why "deleted" rows still appear in their reports.

**Move to a `_deleted` table.** Insert into `invoices_deleted` with a `_deleted_at` timestamp, then delete from the main table. Only worth the operational complexity when governance or audit requirements demand a record of what was deleted and when.

## The two-scope case worth knowing about

The classic complication is any header-detail pair like `invoices` / `invoice_lines`, or `orders` / `order_lines`. Open headers get hard-deleted regularly, but the detail rows also get hard-deleted independently of their headers, not just via cascade. That creates two detection scopes you have to handle separately.

For header deletes, compare `invoice_id` sets between source and destination. For line deletes, compare `(invoice_id, line_num)` sets within each header that still exists, because a header that hasn't changed can still have lines removed underneath it -- and a cursor on the header's `updated_at` is blind to that entirely.

The SAP B1 version of this is particularly nasty: removing a single `invoice_line` triggers a delete-and-reinsert of <span class="text-negative" style="font-weight:bold;">all surviving lines</span> with new `LineNum` values. The old line numbers are gone, the new ones look like fresh inserts, and a full ID comparison catches it while a cursor never will.

---

The pattern across all of this is that delete detection is a separate mechanism that lives alongside extraction, runs on its own cadence, and reconciles state rather than tracking change. Treat it that way from the start and the worst case is a count mismatch you investigate the next morning instead of a discrepancy you discover at the next audit -- and if your tables are small enough that a periodic full replace handles delete detection automatically, that's still the right move. <span class="text-positive" style="font-weight:bold;">Full replace is the cheapest delete-detection mechanism that exists</span>; everything in this post is what you reach for once full replace stops fitting in the schedule window.
