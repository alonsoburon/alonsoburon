#set page(
  paper: "a4",
  margin: (x: 1.6cm, y: 1.4cm),
)
#set text(font: "Inter", size: 9.6pt, fill: rgb("#1a1a1a"))
#set par(leading: 0.55em, justify: false)
#show link: it => underline(text(fill: rgb("#0a66c2"), it))

#let accent = rgb("#0a66c2")
#let muted  = rgb("#5a5a5a")

#let section(title) = {
  v(0.45em)
  block(
    stroke: (bottom: 0.6pt + accent),
    inset: (bottom: 2pt),
    width: 100%,
    text(weight: "bold", size: 10.5pt, fill: accent, upper(title))
  )
  v(0.25em)
}

#let role(title, org, dates) = {
  grid(
    columns: (1fr, auto),
    align: (left, right),
    [*#title* · #text(fill: accent, org)],
    text(fill: muted, dates)
  )
}

// ─── Header ──────────────────────────────────────────
#align(center)[
  #text(size: 20pt, weight: "bold")[Alonso Burón]
  #v(-0.4em)
  #text(fill: muted, size: 10.5pt)[Lead Data Engineer · Composer]
  #v(-0.2em)
  #text(size: 9pt)[
    Santiago, Chile · #link("mailto:nuxapower@gmail.com")[nuxapower\@gmail.com] ·
    #link("https://alonsoburon.cl")[alonsoburon.cl] ·
    #link("https://linkedin.com/in/alonsoburon")[linkedin/alonsoburon] ·
    #link("https://github.com/alonsoburon")[github/alonsoburon]
  ]
]

#v(0.3em)

// ─── Summary ─────────────────────────────────────────
Lead Data Engineer at Datawalt (Santiago, Chile), where I architect and run *Warp*, an EtLT platform consolidating 60+ enterprise systems (SAP Business One, SAP HANA, Softland, Odoo) into BigQuery and ClickHouse. Classically trained composer turned engineer; I lead a team building production data infrastructure for clients across Chile.

// ─── Experience ──────────────────────────────────────
#section("Experience")

#role("Data Engineering Lead", "Datawalt", "Oct 2024 — Present")
- Architect and own *Warp*, an in-house EtLT platform replacing Fivetran for 60+ enterprise sources (SAP B1, HANA, Softland, Odoo) feeding BigQuery and ClickHouse.
- Lead a small data engineering team; promoted into role by reframing scope from individual delivery to platform scalability.
- Designed the ECL (Extract, Conform, Load) framework powering production pipelines: incremental cursor extraction, staging swap, health tables, tiered freshness.
- Built parametrized Power BI / DAX reporting templates and unified HR star-schema (Talana, GeoVictoria, Buk) for multi-client deployment.
- Stack: Python · Go · SQL · Dagster · dlt · dbt · BigQuery · ClickHouse · DuckDB · GCP · Docker · GitHub Actions.

#role("Data Engineer", "Datawalt", "2023 — Oct 2024")
- Delivered enterprise ELT pipelines and Power BI semantic models for finance, sales, and operations clients (Bag, Enaex, Janssen, Canontex, others).
- Owned SAP B1 / HANA extraction patterns, star-schema modeling, and DAX/Deneb (Vega) visualizations.

// ─── Selected Projects ───────────────────────────────
#section("Selected Projects")

- *Warp Data Platform* — EtLT platform unifying 60+ enterprise systems into BigQuery / ClickHouse. _Python · Go · SQL · GCP._
- *#link("https://github.com/alonsoburon/portfolio-streaming")[Streaming Pipeline]* — Real-time e-commerce analytics with anomaly detection. _Kafka · Streamlit · Parquet._
- *#link("https://github.com/alonsoburon/portfolio-batchElt")[Batch ELT Pipeline]* — Medallion architecture on NYC Taxi data. _Dagster · dlt · dbt · DuckDB · Plotly._
- *HR Multi-Platform Integration* — Unified star-schema across Talana, GeoVictoria, Buk. _Python · REST APIs · BigQuery._

// ─── Skills ──────────────────────────────────────────
#section("Skills")

#grid(
  columns: (auto, 1fr),
  column-gutter: 0.6em,
  row-gutter: 0.35em,
  text(weight: "bold")[Warehouses],   [BigQuery · ClickHouse · DuckDB · Snowflake · SAP HANA · Apache Iceberg · Delta],
  text(weight: "bold")[Orchestration], [Dagster · Prefect · dbt · dlt · DolphinScheduler · Kafka],
  text(weight: "bold")[Languages],     [Python · Go · SQL · TypeScript · Node.js],
  text(weight: "bold")[Infra],         [GCP · Docker · GitHub Actions · CI/CD · Linux · Tailscale],
  text(weight: "bold")[BI],            [Power BI · DAX · Deneb (Vega) · Plotly · D3.js],
)

// ─── Writing ─────────────────────────────────────────
#section("Selected Writing")

- #link("https://alonsoburon.cl/blog/0003_incremental_loading_rules_for_multiple_cases")[Incremental Ingestion Cheat-Sheet] — Batch ingestion patterns for real (ugly) data.
- #link("https://alonsoburon.cl/blog/0002_leading_data_engineering_team")[Promoted to Team Lead by Thinking About Scalability] — Growth over pure technical depth.
- #link("https://alonsoburon.cl/blog/0001_from-music-student-to-data-lead")[From Music Student to Data Engineering Lead] — Career origin story.

// ─── Education ───────────────────────────────────────
#section("Education")

#role("Diploma in Data Science", "Pontificia Universidad Católica de Chile (PUC)", "2023 — 2024")
#role("Bachelor's in Music Composition", "Pontificia Universidad Católica de Chile (PUC)", "2019 — 2023")
#role("BSc Data Science (in progress)", "IU International University of Applied Sciences", "2024 — Present")
