---
title: "Don't pre-aggregate, land the movements and build the photo downstream"
date: '2026-05-04'
description: "Why every consumer who says they only need the totals will eventually ask for the detail."
---

The first request from every non-technical consumer sounds the same. "How much did we sell?" They want a total, by month, by product, by warehouse. The temptation is to build that aggregation into the extraction -- `SELECT product_id, SUM(quantity) FROM order_lines GROUP BY product_id` -- and hand them exactly what they asked for. Clean, simple, one table with the numbers they need.

Then they ask "which orders drove the spike in product X?" And the detail isn't in your warehouse, because you extracted the SUM and threw away the rows. You can't drill down from a total to its components. You can't recompute the aggregation with a different grouping. You can't debug a number that looks wrong because the individual records that produced it were never loaded. <span class="text-negative" style="font-weight:bold;">Every</span> consumer who starts with "just give me the totals" eventually asks for the detail, and if you aggregated at extraction the only way to answer is to rebuild the pipeline.

This post is about protecting the destination from that moment. Land the detail, build the totals downstream, in views that consumers can query and that you can change when the business logic changes -- without ever touching the pipeline.

## Where the boundary actually is

The line between conforming and transformation runs through aggregation. Landing `inventory_movements` as-is is conforming, because the source has those rows and you're cloning them. Building `inventory_current` by summing movements is transformation, because you're computing a derived state that encodes business logic -- which movement types to include, how to handle negative quantities, whether to count pending transfers.

The same applies to derived columns. `revenue = quantity * unit_price` looks harmless in the extraction query, but it's a business calculation. The moment discounts apply, taxes enter the formula, or currency conversion becomes relevant, that column is wrong in every historical row, and the only fix is a full backfill. Land `quantity` and `unit_price` as separate columns and let downstream compute whatever formula the business currently uses.

The distinction matters because aggregations and derivations encode decisions that <span class="text-positive" style="font-weight:bold;">belong to the people who understand the business context</span> -- and those decisions change. A grouping that makes sense today ("revenue by product category") stops making sense when the category taxonomy changes. A formula that's correct today is wrong next quarter when the pricing model shifts. If the pipeline made those decisions at extraction, every change is a pipeline change. If a downstream view made them, the view changes and the pipeline keeps running untouched.

## The exception worth naming

Some source tables are already pre-aggregated -- a `metrics_daily` table that the source system computes itself, an ERP's pre-built financial summary view, an analytics product's nightly rollup. The aggregation decision was made upstream rather than by your pipeline, so landing the table as-is is just cloning what the source has, aggregation included.

The rule isn't "never land aggregates," it's <span class="text-positive" style="font-weight:bold;">don't aggregate in the pipeline</span>. If the source already did it, fine. If you're tempted to do it yourself, that's the moment to stop and build a view downstream instead.

## Movements vs. photos

Two kinds of data, two different representations of the same reality.

| Movements                                  | Photos                                      |
|--------------------------------------------|---------------------------------------------|
| Append-only event records                  | Point-in-time snapshots                     |
| Each row is something that happened        | Each row is the state of something right now |
| History is in the rows themselves          | History is gone the moment the next snapshot overwrites it |
| `inventory_movements`, `order_lines`, `events` | `inventory`, `metrics_daily`            |

Land both when both exist at the source. The `inventory` table (what's on the shelf right now) and the `inventory_movements` table (every stock change ever) are different data -- the photo and the movements don't always agree, because bulk imports often update `inventory` directly without logging a movement, and that kind of soft-rule violation is exactly the contamination your pipeline shouldn't paper over. Land both, let the discrepancy be visible to consumers, and let the business decide which version of reality to trust for which question.

Downstream can reconstruct photos from movements if it wants to -- stock as of any date is a `SUM(quantity) WHERE created_at <= target_date`. The inverse isn't possible: <span class="text-negative" style="font-weight:bold;">you can't recover individual movements from a snapshot total</span>. Detail produces aggregates, aggregates don't produce detail.

## How the conversation actually plays out

The request always starts simple: "how much did we sell last month?" You land `order_lines`, build a view that sums `quantity * unit_price` grouped by month, and the consumer is happy. Then it goes:

- "Can I see that by product?" -- change the `GROUP BY` in the view, no pipeline change.
- "Can I see which orders had returns?" -- filter on `quantity < 0` in the detail, only possible because the detail is there.
- "Can I see the monthly trend for this specific SKU?" -- filter the view by SKU, still no pipeline change.
- "Wait, these numbers don't match the ERP's report" -- compare your `order_lines` detail against the source row by row, only possible because you have the rows rather than just the total.

Every one of these follow-up questions is answerable because the detail was landed. None would be answerable if the pipeline had extracted `SUM(quantity * unit_price) GROUP BY month`. The consumer who said "I just need the monthly total" needed the detail all along -- they just didn't know it yet.

## What consumers actually need

A pre-built view that aggregates the raw data for their specific use case. The view is downstream, documented, and changeable without touching the pipeline -- and different consumers can have different aggregations over the same raw data. The sales team sees revenue by product, the finance team sees revenue by cost center, the warehouse team sees units shipped by location, all from the same `order_lines` table, each through their own view.

When the business logic changes (a new product category, a different grouping, a revised pricing formula), the view changes. The pipeline doesn't.

## Two anti-patterns to refuse, every time

**Don't extract SUMs instead of rows.** `SELECT product_id, SUM(quantity) FROM order_lines GROUP BY product_id` as your extraction query means the per-line detail never reaches the destination. The total looks correct until someone needs to drill down, and then there's nothing to drill into.

**Don't compute derived columns at extraction.** `revenue = quantity * unit_price` in the extraction query is a business calculation baked into the pipeline. When the formula changes, every historical row is wrong and the only fix is a full backfill of the entire table. Land the raw columns, compute downstream.

---

This is the pattern I argue about most with non-technical clients, and the resolution is almost always the same: agree to build the view they wanted, but build it on top of the detail they didn't think they needed. Six months later they always ask the question that would've sunk the pre-aggregated version, and the view answers it without anyone touching the pipeline. <span class="text-positive" style="font-weight:bold;">That's the test.</span>

The deeper point is about where the cost of a wrong decision lives. A pipeline that pre-aggregates pushes the cost of every future schema change, every business-rule update, every drill-down request into a backfill of all historical data. A pipeline that lands detail pushes those costs into a downstream view that takes minutes to change. Neither is free, but one is recoverable and the other is a rebuild. Land the detail, build the photo downstream, and let the business own the part of the system they're actually equipped to change.
