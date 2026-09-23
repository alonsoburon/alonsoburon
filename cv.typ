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
  #text(fill: muted, size: 10.5pt)[Lead Data & AI Engineer · Agent Systems · Client-Facing]
  #v(-0.2em)
  #text(size: 9pt)[
    Santiago, Chile · #link("mailto:alonso.buron@proton.me")[alonso.buron\@proton.me] ·
    #link("https://alonsoburon.cl")[alonsoburon.cl] ·
    #link("https://linkedin.com/in/alonsoburon")[linkedin/alonsoburon] ·
    #link("https://github.com/alonsoburon")[github/alonsoburon]
  ]
]

#v(0.3em)

// ─── Summary ─────────────────────────────────────────
Lead Data & AI Engineer at Datawalt (Santiago, Chile), where I architect and run *Warp*, an EtLT platform consolidating 60+ enterprise systems (SAP B1, HANA, Softland, Odoo) into BigQuery and ClickHouse. I design *agentic systems* — MCP servers, Claude/Agent Skills, cost-tiered multi-agent orchestration and agent-harness tooling — and own client-facing delivery from discovery to production. I lead a team building production data infrastructure across Chile.

// ─── Experience ──────────────────────────────────────
#section("Experience")

#role("Data Engineering Lead", "Datawalt", "Oct 2024 — Present")
- Architect and own *Warp*, an in-house EtLT platform replacing Fivetran for 60+ enterprise sources (SAP B1, HANA, Softland, Odoo) feeding BigQuery and ClickHouse.
- Lead a small data engineering team; promoted for reframing scope from delivery to platform scalability.
- Designed the ECL (Extract, Conform, Load) framework powering production pipelines: incremental cursor extraction, staging swap, health tables, tiered freshness.
- Built parametrized Power BI / DAX reporting templates and unified HR star-schema (Talana, GeoVictoria, Buk) for multi-client deployment.
- Stack: Python · Go · SQL · Dagster · dbt · dlt · BigQuery · ClickHouse · DuckDB · GCP · Docker.

#role("Data Engineer", "Datawalt", "2023 — Oct 2024")
- Delivered enterprise ELT pipelines and Power BI semantic models for finance, sales and operations clients (Bag, Enaex, Janssen, Canontex); owned SAP B1 / HANA extraction and star-schema modeling.

#role("Founder & Consultant", "Tucunar (independent)", "2026 — Present")
- Run a technology-services practice end to end: client discovery, scoping/SOWs and delivery of data, infra and AI work for SMEs and mining clients.

// ─── AI & Agent Systems ──────────────────────────────
#section("AI & Agent Systems")

- *Multi-agent orchestration* — Self-hosted, cost-tiered agents (DeepSeek + Claude) behind a shared relay with per-agent identity and least-privilege access. _Nostr · ACP · Docker._
- *MCP & tool use* — Shipped an MCP server and open API for point-in-time macro data, so agents query series safely without look-ahead bias. _TypeScript · MCP · Vercel._
- *Agent Skills & FOSS* — Author of *ecl-skill*; contributor to *netresearch/retro-skill* (opencode adapter). _Claude Code · Python._
- *Harness, gates & observability* — Maintain CLAUDE.md rules, skills and MCP context for coding agents; ship through gate-enforced CI/CD; run pipeline health tables and SLA alerting. _Claude Code · CI/CD._

// ─── Selected Projects ───────────────────────────────
#section("Selected Projects")

- *#link("https://github.com/alonsoburon/vintage")[vintage]* — Point-in-time macro data for Chile as an open API + MCP server for agents. _TypeScript · MCP · Vercel._
- *#link("https://github.com/alonsoburon/toka")[toka]* — Offline-first household tasks: Go + PostgreSQL with row-level security, Android client. _Go · PostgreSQL · Android._

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
  text(weight: "bold")[AI / Agents],   [Claude Code · Agent Skills · MCP · Multi-agent orchestration · Claude Agent SDK (ACP) · LLMOps/observability],
  text(weight: "bold")[BI],            [Power BI · DAX · Deneb (Vega) · Plotly · D3.js],
)

// ─── Education ───────────────────────────────────────
#section("Education")

*Data Science Diploma* & *Music Composition B.A.*, PUC Chile · *BSc Data Science (in progress)*, IU International
