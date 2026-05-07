---
title: 'Purity vs. freshness, the tradeoff every pipeline already made'
date: '2026-01-15'
description: "Why full replace is the default, and when to deviate from it."
---

Every pipeline decision -- how to extract, how often to run, how to load -- is a position on a single tradeoff that almost nobody explicitly thinks about. Most pipelines take a position by accident, and then somebody inherits the unexamined defaults six months later when something breaks at 3 AM.

The tradeoff is between <span class="text-positive" style="font-weight:bold;">purity</span> and <span class="text-positive" style="font-weight:bold;">freshness</span>, and the right point on the spectrum depends on the table, the consumer, and the SLA -- not on a universal default.

## What each end actually means

**Purity** means the destination is an exact clone of the source at a given point in time, with no drift, no missed rows, and no accumulated damage from soft-rule violations or unreliable cursors. A full replace achieves this for free, because every run resets the world: pull everything, replace everything, the destination matches the source as of the extraction timestamp.

**Freshness** means how recently the destination reflects the source. A table refreshed every 15 minutes is fresh; a table refreshed nightly is stale by mid-morning.

The tension between them is structural rather than incidental. Full replace maximizes purity but caps freshness at the duration of a full scan -- you can only refresh as often as the scan completes. Incremental maximizes freshness but trades purity, because missed rows, unreliable cursors, and accumulated drift are inherent to the approach. Every incremental pipeline carries a <span class="text-neutral" style="font-style:italic;">purity debt</span> that grows until the next full reset corrects it.

## Why full replace deserves to be the default

A full replace has properties that incremental fundamentally can't match. It's stateless and idempotent, so running it twice produces the same result and there's no cursor state, no checkpoint files, no decisions accumulating across runs -- if something goes wrong, you rerun and the destination is correct again. It catches everything a cursor misses: hard deletes, retroactive corrections, soft-rule violations, schema drift, rows that prior incrementals dropped. And it has no drift accumulation, because every run is the source of truth as of that moment.

The cost is the freshness ceiling. A full scan of `orders` that takes three hours means the freshest you can be on a pure full-replace strategy is three hours behind, and that's assuming the scan starts the moment the previous one ends. For most tables and most businesses, this is completely acceptable -- the dashboard reviewed at 9 AM is not harmed by a nightly full replace that completes at 6 AM.

## What incremental actually costs

Incremental extraction is a performance optimization, necessary when the table is too large to scan completely within the schedule window but always an optimization with the fragility that implies. The cost is real and routinely underestimated.

**Cursor reliability is a soft rule.** The assumption that every write to a row bumps `updated_at` is an expectation, not an enforcement. Bulk scripts bypass it, ORM hooks miss it, back-office tools don't know it exists. Every row that changes without bumping the cursor is a row your pipeline will <span class="text-negative" style="font-weight:bold;">never</span> see update.

**Hard deletes are invisible.** A deleted row leaves no trace for a cursor to find, so you need a separate detection mechanism -- a full ID comparison, a count reconciliation, a tombstone table -- and each one adds complexity with its own failure modes.

**High frequency has a monetary cost.** 288 extractions per day (every five minutes) means 288 load jobs, 288 sets of DML on the destination, 288 opportunities for partial failures. On BigQuery that's 288 jobs against your DML quota; on Snowflake it's warehouse time burning all day. Freshness has a price, and incremental at high frequency is where you pay it.

**Drift accumulates silently.** A missed row today is still wrong tomorrow. An incremental that's been running for six months with a slightly unreliable cursor has six months of accumulated drift that nobody has quantified, and the destination *looks* correct because it has data -- it just doesn't match the source.

## How to classify a table

Work through these in order. The earlier you exit, the simpler your pipeline.

| # | Question                              | If yes / no                                            |
|---|---------------------------------------|--------------------------------------------------------|
| 1 | Does the consumer actually need sub-daily freshness? | If no -> full replace, conversation over.   |
| 2 | Does a full scan fit comfortably in the schedule window? | If yes -> full replace.                  |
| 3 | Does the source rewrite history retroactively? | If yes -> full replace, regardless of size.    |
| 4 | Is the cursor reliable? (run the checks)       | If no -> scoped replace or hash detection.     |
| 5 | Are there hard deletes?               | If yes -> incremental + delete detection + periodic full reset. |
| 6 | None of the above                     | Plain incremental cursor.                              |

The first question is the one most teams skip. <span class="text-neutral" style="font-style:italic;">"Real time"</span> almost never means real time -- it means "faster than it is now." Pressing for a concrete number usually reveals that the actual SLA is "no more than 30 minutes of delay" rather than "updated every 30 minutes," and giving consumers a way to trigger an on-demand extraction often reduces scheduled frequency dramatically without sacrificing the freshness they actually use.

## The hybrid that buys both

For tables where you need both purity and freshness -- mutable, large, sub-daily SLA -- the answer is a hybrid: full replace nightly to reset purity, incremental intraday to deliver freshness. The intraday incremental doesn't need to be perfect, and that's the trick -- it doesn't need to catch hard deletes, doesn't need a wide lookback, doesn't need delete detection -- because the nightly full replace will correct everything it missed. Design the incremental to be fast and simple, because it isn't the source of truth.

> The incremental's failure mode becomes manageable under this design. If a run misses, the data is stale by one interval until the next incremental or the nightly full. If drift accumulates, the nightly reset wipes it. The incremental is a <span class="text-positive" style="font-weight:bold;">freshness layer</span> sitting on top of a reliable purity foundation, not a replacement for one.

## A position worth defending

The default for any new table should be full replace, and every deviation toward incremental should be a documented decision: what made full replace infeasible, what purity tradeoffs were accepted, what the plan is for correcting drift. If you can't articulate why you need incremental, you probably don't -- and the simpler, statelessly idempotent pipeline you avoided is the one you'll wish you had built when you're debugging six months from now.

The next post gets specific about the case that breaks every cursor: <span class="emphasis">hard delete detection</span>, and the surprisingly limited menu of mechanisms for handling it.
