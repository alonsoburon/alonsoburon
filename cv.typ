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
  #text(size: 20pt, weight: "bold")[Alonso Burón Ardiles]
  #v(-0.4em)
  #text(size: 9pt)[
    Santiago, Chile · #link("tel:+56959058121")[+56 9 5905 8121] · #link("mailto:alonso.buron@proton.me")[alonso.buron\@proton.me] \
    #link("https://alonsoburon.cl")[alonsoburon.cl] ·
    #link("https://linkedin.com/in/alonsoburon")[linkedin/alonsoburon] ·
    #link("https://github.com/alonsoburon")[github/alonsoburon]
  ]
]

#v(0.3em)

// ─── Summary ─────────────────────────────────────────
Data Engineering Lead at Datawalt. Built and lead a team of 5 and designed *Warp*, a data integration platform serving over 500 companies and processing 1.6 TB daily. I combine data architecture, business analytics and agentic systems to turn client needs into production solutions, with a focus on scalability, reliability and data contracts.

// ─── Experience ──────────────────────────────────────
#section("Experience")

#role("Data Engineering Lead", "Datawalt", "Oct 2024 — Present")
- Designed and lead *Warp*: 150 enterprise integrations (SAP B1, HANA, Softland, Odoo) replacing Fivetran and centralizing data in BigQuery and ClickHouse through real-time and batch pipelines.
- Built Datawalt's first data engineering team, now 5 people, focused on scalability, reliability and connector development.
- Designed idempotent loads, staging swaps and safe backfills, with pipeline health and data freshness monitoring.
- Developed bidirectional connectors for SAP, QAD and Dynamics 365; maintain per-client isolation on GCP and deployments through GitHub Actions with self-hosted runners.
- Stack: Python · Go · SQL · Dagster · dbt · dlt · BigQuery · ClickHouse · DuckDB · GCP · Docker.

#role("BI Developer", "Datawalt", "2023 — Oct 2024")
- Built dozens of star schemas integrating HR, CRM, ERP and sell-out data, and Power BI semantic models for finance, mining and operations clients (Bagó, Enaex, Janssen, Canontex).
- Created parameterized Power BI / DAX templates for SAP B1 financial reporting and a unified HR model (Talana, GeoVictoria, Buk), reusable across clients.
- Optimized BigQuery costs using INFORMATION_SCHEMA and materialized staging tables.

// #role("Founder & Consultant", "Tucunar (independent)", "2026 — Present")
// - Run a technology-services practice end to end: client discovery, scoping/SOWs and delivery of data, infra and AI work for SMEs and mining clients.

// ─── AI & Agent Systems ──────────────────────────────
#section("AI & Agent Systems")

- *Multi-agent orchestration* — Designed and operate self-hosted agents (DeepSeek + Claude), coordinated through a shared relay with per-agent identity and least-privilege access. _Nostr · ACP · Docker._
- *MCP & tools* — Built MCP servers for multiple business functions, connecting agents to internal data and tools. _TypeScript · MCP._
- *Agent Skills & FOSS* — Author of *ecl-skill* for production pipelines; contributor to *netresearch/retro-skill* (opencode adapter). _Claude Code · Python._
- *Controls & observability* — Maintain rules, skills and MCP context for coding agents; automate deployments with CI/CD checks, pipeline monitoring and SLA alerts.

// ─── Selected Projects ───────────────────────────────
#section("Selected Projects")

- *#link("https://www.datawalt.cl/soluciones/warp")[Warp]* — Architecture and development of Datawalt's integration platform: extracting, normalizing and publishing enterprise data for analytics. _Python · Go · BigQuery · ClickHouse._
- *#link("https://www.datawalt.cl/sap-business-one")[SAP Business One Integration]* — SAP B1 / HANA data extraction, star-schema modeling and reusable financial reporting templates for clients. _SQL · BigQuery · Power BI · DAX._

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
  text(weight: "bold")[AI / Agents],   [Claude Code · Agent Skills · MCP · Multi-agent orchestration · LLMOps/observability],
  text(weight: "bold")[BI],            [Power BI · DAX · Deneb (Vega) · Plotly · D3.js],
  text(weight: "bold")[Spoken languages], [Spanish: native · English: expert proficiency],
)

// ─── Education ───────────────────────────────────────
#section("Education")

*Data Science Diploma* & *Music Composition B.A.*, PUC Chile
