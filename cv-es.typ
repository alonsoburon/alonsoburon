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

// ─── Encabezado ──────────────────────────────────────
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

// ─── Perfil ──────────────────────────────────────────
Líder de Ingeniería de Datos en Datawalt. Formé y lidero un equipo de 5 personas y diseñé *Warp*, una plataforma de integración de datos para más de 500 empresas que procesa 1,6 TB diarios. Combino arquitectura de datos, analítica de negocio y sistemas agénticos para llevar necesidades de clientes a soluciones en producción, con foco en escalabilidad, confiabilidad y contratos de datos.

// ─── Experiencia ─────────────────────────────────────
#section("Experiencia")

#role("Líder de Ingeniería de Datos", "Datawalt", "Oct 2024 — Actualidad")
- Diseñé y lidero *Warp*: 150 integraciones empresariales (SAP B1, HANA, Softland, Odoo) que reemplazan Fivetran y centralizan datos en BigQuery y ClickHouse, con flujos en tiempo real y por lotes.
- Formé el primer equipo de ingeniería de datos de Datawalt, hoy de 5 personas, con foco en escalabilidad, confiabilidad y desarrollo de conectores.
- Diseñé cargas idempotentes, staging swap y backfills seguros, con monitoreo de salud y frescura de datos.
- Desarrollé conectores bidireccionales para SAP, QAD y Dynamics 365; mantengo aislamiento por cliente en GCP y despliegues con GitHub Actions y runners propios.
- Stack: Python · Go · SQL · Dagster · dbt · dlt · BigQuery · ClickHouse · DuckDB · GCP · Docker.

#role("BI Developer", "Datawalt", "2023 — Oct 2024")
- Construí decenas de modelos estrella integrando RR. HH., CRM, ERP y sell-out, y modelos semánticos de Power BI para finanzas, minería y operaciones (Bagó, Enaex, Janssen, Canontex).
- Creé plantillas parametrizadas de Power BI / DAX para finanzas en SAP B1 y un modelo unificado de RR. HH. (Talana, GeoVictoria, Buk), reutilizables entre clientes.
- Optimicé costos en BigQuery mediante INFORMATION_SCHEMA y tablas de staging materializadas.

// #role("Fundador y Consultor", "Tucunar (independiente)", "2026 — Actualidad")
// - Dirijo una práctica de servicios tecnológicos: discovery, alcance/SOW y entrega de datos, infraestructura e IA para PYMEs y clientes mineros.

// ─── Sistemas de IA y Agentes ────────────────────────
#section("Sistemas de IA y Agentes")

- *Orquestación multi-agente* — Diseñé y opero agentes autoalojados (DeepSeek + Claude), coordinados mediante un relay compartido, con identidad y mínimo privilegio por agente. _Nostr · ACP · Docker._
- *MCP y herramientas* — Construí servidores MCP para distintas áreas de la empresa, conectando agentes con datos y herramientas internas. _TypeScript · MCP._
- *Agent Skills y FOSS* — Autor de *ecl-skill* para pipelines en producción; contribuidor a *netresearch/retro-skill* (adaptador de opencode). _Claude Code · Python._
- *Controles y observabilidad* — Mantengo reglas, skills y contexto MCP para agentes de código; automatizo despliegues con controles CI/CD y monitoreo de pipelines y alertas SLA.

// ─── Proyectos Destacados ────────────────────────────
#section("Proyectos Destacados")

- *#link("https://www.datawalt.cl/soluciones/warp")[Warp]* — Arquitectura y desarrollo de la plataforma de integración de Datawalt: extracción, normalización y publicación de datos empresariales para analítica. _Python · Go · BigQuery · ClickHouse._
- *#link("https://www.datawalt.cl/sap-business-one")[Integración con SAP Business One]* — Extracción de datos SAP B1 / HANA, modelado en esquema estrella y plantillas financieras reutilizables para clientes. _SQL · BigQuery · Power BI · DAX._

// ─── Habilidades ─────────────────────────────────────
#section("Habilidades")

#grid(
  columns: (auto, 1fr),
  column-gutter: 0.6em,
  row-gutter: 0.35em,
  text(weight: "bold")[Almacenes],   [BigQuery · ClickHouse · DuckDB · Snowflake · SAP HANA · Apache Iceberg · Delta],
  text(weight: "bold")[Orquestación], [Dagster · Prefect · dbt · dlt · DolphinScheduler · Kafka],
  text(weight: "bold")[Lenguajes],     [Python · Go · SQL · TypeScript · Node.js],
  text(weight: "bold")[Infra],         [GCP · Docker · GitHub Actions · CI/CD · Linux · Tailscale],
  text(weight: "bold")[IA / Agentes],  [Claude Code · Agent Skills · MCP · Orquestación multi-agente · LLMOps/observabilidad],
  text(weight: "bold")[BI],            [Power BI · DAX · Deneb (Vega) · Plotly · D3.js],
  text(weight: "bold")[Idiomas],       [Español: nativo · Inglés: experto],
)

// ─── Educación ───────────────────────────────────────
#section("Educación")

*Diplomado en Data Science* y *Licenciatura en Composición Musical*, PUC Chile
