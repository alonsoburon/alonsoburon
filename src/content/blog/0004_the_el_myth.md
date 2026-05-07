---
title: 'The EL myth, and why I started calling it ECL'
date: '2025-12-04'
description: "Pure EL doesn't exist. Every pipeline conforms whether it admits it or not."
---

I started writing a book a couple of weeks ago, mostly because I went looking for a strategy reference on what I do all day and couldn't find one. What I do all day is move data from <span class="emphasis">someone else's transactional database</span> into a warehouse, about 6500 tables of it, and every framework I'd been sold on -- ETL, ELT, EtLT, the whole acronym lineup -- left out the actual hard part.

## ETL was honest, ELT lied a little

ETL works when the same person owns the business layer and the data layer, which is true for most analysts because they sit closest to the consumption side. But handling the intricacies of querying a database without blowing it up with full table scans is a skill most analysts don't have, which is why ELT showed up: <span class="text-positive" style="font-weight:bold;">Extract</span> the data, <span class="text-positive" style="font-weight:bold;">Load</span> it raw into a warehouse, then <span class="text-positive" style="font-weight:bold;">Transform</span> it once it's there.

The pitch is reasonable until you remember that OLTP and OLAP are <span class="text-negative" style="font-weight:bold;">fundamentally different beasts</span>, and no two SQL dialects agree on what a `DATETIME2` is supposed to mean. You can't simply hand BigQuery a column from SQL Server and walk away -- types need casting, timezones need handling, and most of the time you also want to update incrementally, which (believe me) increases complexity ten-fold.

> BigQuery has no naive timestamp type, so every `TIMESTAMP` is UTC. Hand it a `timestamp without time zone` from PostgreSQL and BigQuery will silently treat it as UTC. If the source was actually storing local Santiago time, every value in your destination is off by three hours, and there's no way to fix it after the fact without knowing the original timezone and reloading.

In practice, pure EL is a <span class="text-neutral" style="font-style:italic;">myth</span>. The moment data crosses systems, something has to give: types need casting, nulls need handling, primary keys need to actually mean something on the other side. That work has to live somewhere, and it's not the T -- because the T is for the analysts, and changing what the data *means* doesn't belong this early in the pipeline.

## So I'm calling it ECL

Extract, Conform, Load. The C is everything the data needs to land correctly on the other side: type casting, null handling, timezone normalization, metadata injection, key synthesis. If it changes what the data <span class="emphasis">means</span>, it doesn't belong in the C; it belongs downstream where the analysts can argue about it.

Here's the boundary I've been using:

| Belongs in the C (Conforming)              | Belongs downstream (Transformation) |
|--------------------------------------------|-------------------------------------|
| `VARCHAR(255)` -> `STRING`                 | `revenue = quantity * unit_price`   |
| `DATETIME` (naive) -> `TIMESTAMP UTC`      | `SUM(amount) GROUP BY month`        |
| Inject `_extracted_at`, `_batch_id`        | Renaming `OACT` to `chart_of_accounts` |
| Synthesize a key on a PK-less table        | Building an SCD2 history table      |
| `tinyint(1)` -> `BOOL`                     | Joining `orders` with `customers` to compute LTV |

The rule of thumb is whether the destination column has the <span class="text-positive" style="font-weight:bold;">same business meaning</span> as the source column. If yes, it's conforming -- if you're computing something the source doesn't store, you've crossed into transformation territory and the pipeline isn't the right place for it.

## What about the T

If the analysts want to transform afterwards -- aggregate, pivot, build dashboards -- that's their domain, and there's a chapter in the book on helping them do it without lighting the warehouse on fire. The relevant part for ECL is just to draw the line and stay on your side of it. Pipelines that <span class="text-negative" style="font-weight:bold;">silently encode business logic</span> into extraction queries become impossible to maintain the moment the business logic changes, which it will.

## Why this matters in practice

Naming the C changes how you build pipelines, because once you stop pretending the data flows through untouched you can start asking the right questions:

- **Where does my pipeline cast types?** Hopefully one place, not twelve.
- **Who decides the timezone policy?** You, before the data lands -- not the analyst at 3 AM.
- **What metadata columns do my consumers need?** `_extracted_at` is non-negotiable, the rest is a tradeoff.
- **Where is the boundary between conforming and transformation written down?** Hopefully somewhere, because if it isn't, every engineer will draw it slightly differently and your warehouse will rot.

The next few posts are going to come straight out of the book as I write it. They're patterns I've been applying for two years without naming, and if you've felt like the existing frameworks didn't quite describe what you actually do all day, this is mostly why I started writing it down. The next one is about the <span class="text-neutral" style="font-style:italic;">lies your sources tell you</span>, which is where most of the trouble actually starts.
