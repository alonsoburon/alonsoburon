---
title: 'Tiered freshness, or how I stopped refreshing everything on the same cron'
date: '2026-03-30'
description: "Hot, warm, and cold tiers — partition the pipeline so the tables that matter most get attention first."
---

The naive approach is one schedule for everything: all tables, same cadence, same extraction method. It works when you have a dozen tables and a daily overnight window, and it stops working when some of those tables need to be fresh within the hour while others haven't changed in months. At that point you're either over-refreshing cold data (wasting compute, money, and source load) or under-refreshing hot data (delivering stale results to consumers), and usually both at once.

The subtler version of the problem is not refreshing everything at the same *frequency* but with the same *method*. We had an `orders` table at one point that ran a full replace of the entire year's data many times a day. The frequency was right -- the table needed intraday updates -- but full-replacing twelve months of data on every run was <span class="text-negative" style="font-weight:bold;">very much not</span>. The DBA noticed before we did. The fix wasn't changing the schedule; it was splitting the table's extraction into tiers: recent data incrementally and often, historical data fully but rarely.

## Three zones, each with its own job

The model is three tiers, each with its own cadence and extraction method. The boundaries between them depend on the table, the source, and the consumer's SLA -- the names are universal, the numbers are not.

| Tier | Cadence              | Method                                | Purity vs. freshness          |
|------|----------------------|---------------------------------------|-------------------------------|
| Hot  | Intraday (sub-hour)  | Cursor incremental on the recent window | Fresh, slightly impure       |
| Warm | Daily (overnight)    | Rolling window replace, or wide-lag incremental | Pure within the window  |
| Cold | Weekly / on-demand   | Full replace of historical data       | Pure, slow, the safety net    |

**Hot** is the actively changing data: today's `orders`, open `invoices`, recent `events`. Refreshed multiple times per day via cursor incremental, with the actual interval driven by table volume, source capacity, and consumer SLA. The hot tier <span class="text-positive" style="font-weight:bold;">tolerates impurity</span>, because slight gaps from late-arriving data or cursor lag aren't catastrophic here -- the warm tier catches them on the next pass.

**Warm** is the current month or quarter -- data that still receives occasional updates but not at high frequency. Refreshed daily, often overnight when the source is under less load, either as a full replace of the warm window or an incremental with a wider lag. The warm tier's job is to re-read recent history with enough depth to catch what the hot tier missed: late cursor updates, backdated transactions, documents that changed without bumping their `updated_at`. Purity matters more here, and you should expect the destination to match the source 99% of the time after each load.

**Cold** is the historical data: prior years, closed fiscal periods, archived partitions. Refreshed weekly, monthly, or only on demand for backfills and corrections, always as a full replace because the volume is bounded and the frequency is low enough that the cost is negligible. The cold tier is your <span class="emphasis">cleanup pass</span> -- a weekly full replace of last year's data resets accumulated drift from the hot and warm tiers, picking up anything that was missed by a cursor or arrived outside the warm window.

## The lag window between tiers

The warm tier's extraction window has to overlap with the hot tier's territory, or changes that happen between the last hot run and the warm run's cutoff fall through the gap. This overlap is the lag window: how far back the warm tier reads beyond its own boundary.

The right lag depends on how reliably the source updates its cursors. For well-organized systems where every modification touches `updated_at`, seven days of lag is enough -- especially when the cold tier runs weekly and catches anything the warm tier missed. For messier systems where back-office edits bypass the application layer (common in ERPs), 30 days is safer. The decision is empirical: start at seven, watch for rows that appear in the cold tier's full replace but were never picked up by warm, and widen the window if it happens regularly.

The cold tier doesn't need a lag because its full replace naturally covers everything. That's what makes it the safety net.

## Assigning tables to tiers

| Signal                                                    | Tier            |
|-----------------------------------------------------------|-----------------|
| Has active writes in the last hour                        | Hot             |
| Has writes in the last 7 days but not the last hour       | Warm            |
| No writes in > 7 days                                     | Cold            |
| Append-only, partitioned by date                          | Hot for today's partition, cold for everything else |
| Open documents (`invoices` with status = draft)           | Hot regardless of write frequency |

Tier assignment can be static (configured per table in the orchestrator) or dynamic (driven by a recent activity signal). Static is simpler and covers most cases -- you generally know which tables are transactional and which are archival. Dynamic earns its complexity when you have hundreds of tables and can't manually classify each one, or when the same table's activity profile shifts seasonally.

Most pipelines don't need all three tiers from day one. About two-thirds of tables in a typical pipeline are lookups and dimensions that full-replace daily and never need anything faster -- incrementalizing everything you *can* is tempting but generates more errors than it saves time or money. The simpler default is to maximize full replace and reserve incremental for the cases that actually demand it. The tier system only really matters for the remaining third.

> Being in the hot tier doesn't automatically mean incremental. A `products` table with 10k rows that needs intraday freshness can full-replace every run without anyone noticing -- the volume is trivial, the extraction takes seconds, and you avoid maintaining cursor state entirely. Incremental earns its place when the table is too large to full-replace at the cadence the consumer needs, not when the consumer wants the data fresh.

## Month-end and seasonal shifts

ERP systems behave differently at month-end and period close, and whether that affects your tiered schedule depends on who consumes the data and why. If the data drives quick decision-making (collections teams chasing receivables before month-end, sales managers tracking targets), consumers will ask for *more* frequency, and promoting tables to the hot tier during the last week of the month gives them fresher data when the stakes are highest. If the data feeds a historical analysis engine that reports after the period closes, consumers will often ask for the *opposite* -- reduce extraction frequency during month-end to avoid competing with the ERP's own close process for database resources, because hammering an ERP during its month-end batch jobs doesn't help anyone.

For pipelines that run overnight only, month-end rarely changes the schedule, because the overnight window already avoids daytime contention and the warm tier's daily refresh picks up whatever happened during the close.

## The two anti-patterns to watch for

The first is mixing tiers on the same cron. If some tables need intraday freshness but share a schedule with everything else, the hot tables wait in line behind cold tables that didn't need refreshing -- and you've effectively converted your hot tier into a slow tier without realizing it. Separate the schedules when you have tables that genuinely need different cadences.

The second is the one that got us with `orders`: same frequency, wrong method. Refreshing a table many times a day is fine; full-replacing a year's worth of data many times a day is <span class="text-negative" style="font-weight:bold;">not</span>. If a table needs intraday freshness, the hot tier should extract only the recent window incrementally -- not reload the entire history on every run. The frequency is a schedule concern, the method is a pattern concern, and getting one right while getting the other wrong is exactly how you end up on the phone with the DBA.

The next post is about the <span class="emphasis">health table</span>, which is the single piece of infrastructure I'd build first if I were starting a pipeline from scratch today.
