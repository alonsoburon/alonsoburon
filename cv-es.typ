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
  #text(size: 20pt, weight: "bold")[Alonso Burón]
  #v(-0.4em)
  #text(fill: muted, size: 10.5pt)[Ingeniero de Datos e IA · Sistemas Agénticos · Cara a Cliente]
  #v(-0.2em)
  #text(size: 9pt)[
    Santiago, Chile · #link("mailto:alonso.buron@proton.me")[alonso.buron\@proton.me] ·
    #link("https://alonsoburon.cl")[alonsoburon.cl] ·
    #link("https://linkedin.com/in/alonsoburon")[linkedin/alonsoburon] ·
    #link("https://github.com/alonsoburon")[github/alonsoburon]
  ]
]

#v(0.3em)

// ─── Perfil ──────────────────────────────────────────
Líder de Datos e IA en Datawalt (Santiago, Chile). Arquitecto de *Warp*, plataforma EtLT que reemplaza a Fivetran para 60+ sistemas empresariales (SAP B1, HANA, Softland, Odoo) hacia BigQuery y ClickHouse. Diseño sistemas agénticos, lidero equipos y la entrega cara a cliente.

// ─── Experiencia ─────────────────────────────────────
#section("Experiencia")

#role("Líder de Ingeniería de Datos", "Datawalt", "Oct 2024 — Actualidad")
- Arquitecto y responsable de *Warp*, plataforma EtLT interna que reemplaza a Fivetran para más de 60 fuentes empresariales (SAP B1, HANA, Softland, Odoo) hacia BigQuery y ClickHouse.
- Lidero un equipo pequeño de ingeniería de datos; ascendí por reencuadrar el alcance desde la entrega individual hacia la escalabilidad de la plataforma.
- Diseñé el framework ECL (Extract, Conform, Load) que soporta los pipelines en producción: extracción incremental por cursor, staging swap, tablas de salud y frescura por niveles.
- Construí plantillas parametrizadas de Power BI / DAX y un esquema estrella unificado de RRHH (Talana, GeoVictoria, Buk) para despliegue multi-cliente.
- Stack: Python · Go · SQL · Dagster · dbt · dlt · BigQuery · ClickHouse · DuckDB · GCP · Docker.

#role("Ingeniero de Datos", "Datawalt", "2023 — Oct 2024")
- Entregué pipelines ELT empresariales y modelos semánticos de Power BI para clientes de finanzas, ventas y operaciones (Bag, Enaex, Janssen, Canontex); responsable de la extracción SAP B1 / HANA y del modelado en esquema estrella.

#role("Fundador y Consultor", "Tucunar (independiente)", "2026 — Actualidad")
- Dirijo una práctica de servicios tecnológicos: discovery, alcance/SOW y entrega de datos, infraestructura e IA para PYMEs y clientes mineros.

// ─── Sistemas de IA y Agentes ────────────────────────
#section("Sistemas de IA y Agentes")

- *Orquestación multi-agente* — Agentes self-hosted por costo (DeepSeek + Claude) tras un relay compartido, con identidad y mínimo privilegio por agente. _Nostr · ACP · Docker._
- *MCP y uso de herramientas* — Desarrollé un servidor MCP y una API abierta de datos macro point-in-time, para que los agentes consulten series sin look-ahead bias. _TypeScript · MCP · Vercel._
- *Agent Skills y FOSS* — Autor de *ecl-skill*; contribuidor a *netresearch/retro-skill* (adaptador de opencode). _Claude Code · Python._
- *Harness, gates y observabilidad* — Mantengo reglas, skills y contexto MCP para agentes de código; despliego con CI/CD con gates; opero salud de pipelines y alertas SLA. _Claude Code · CI/CD._

// ─── Proyectos Destacados ────────────────────────────
#section("Proyectos Destacados")

- *#link("https://github.com/alonsoburon/vintage")[vintage]* — Datos macro point-in-time de Chile como API abierta + servidor MCP para agentes. _TypeScript · MCP · Vercel._
- *#link("https://github.com/alonsoburon/toka")[toka]* — Tareas domésticas offline-first: Go + PostgreSQL con RLS, cliente Android. _Go · PostgreSQL · Android._

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
)

// ─── Educación ───────────────────────────────────────
#section("Educación")

*Diplomado en Data Science* y *Licenciatura en Composición Musical*, PUC Chile · *BSc Data Science*, IU International
