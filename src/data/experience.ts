/**
 * experience.ts — work history and stack, in both locales.
 *
 * Source of truth for the /experience page. The same facts appear on the
 * one-page CV (cv.typ) and in the machine-readable layer; keep them in sync.
 */

export interface ExperienceRole {
  title: string;
  titleEs: string;
  org: string;
  orgUrl?: string;
  dates: string;
  datesEs: string;
  bullets: string[];
  bulletsEs: string[];
}

export const roles: ExperienceRole[] = [
  {
    title: 'Data Engineering Lead',
    titleEs: 'Líder de Ingeniería de Datos',
    org: 'Datawalt',
    orgUrl: 'https://datawalt.cl',
    dates: 'Oct 2024 — Present',
    datesEs: 'Oct 2024 — Presente',
    bullets: [
      'Architect and own Warp, an in-house EtLT platform replacing Fivetran for 60+ enterprise sources (SAP B1, HANA, Softland, Odoo) feeding BigQuery and ClickHouse.',
      'Lead a small data engineering team; promoted for reframing scope from delivery to platform scalability.',
      'Designed the ECL (Extract, Conform, Load) framework powering production pipelines: incremental cursor extraction, staging swap, health tables, tiered freshness.',
      'Built parametrized Power BI / DAX reporting templates and a unified HR star-schema (Talana, GeoVictoria, Buk) for multi-client deployment.',
    ],
    bulletsEs: [
      'Arquitecto y responsable de Warp, una plataforma EtLT interna que reemplaza a Fivetran para más de 60 fuentes empresariales (SAP B1, HANA, Softland, Odoo) hacia BigQuery y ClickHouse.',
      'Lidero un equipo pequeño de ingeniería de datos; ascendí por reencuadrar el alcance desde la entrega individual hacia la escalabilidad de la plataforma.',
      'Diseñé el framework ECL (Extract, Conform, Load) que soporta los pipelines en producción: extracción incremental por cursor, staging swap, tablas de salud y frescura por niveles.',
      'Construí plantillas parametrizadas de Power BI / DAX y un esquema estrella unificado de RRHH (Talana, GeoVictoria, Buk) para despliegue multi-cliente.',
    ],
  },
  {
    title: 'Data Engineer',
    titleEs: 'Ingeniero de Datos',
    org: 'Datawalt',
    orgUrl: 'https://datawalt.cl',
    dates: '2023 — Oct 2024',
    datesEs: '2023 — Oct 2024',
    bullets: [
      'Delivered enterprise ELT pipelines and Power BI semantic models for finance, sales and operations clients (Bag, Enaex, Janssen, Canontex).',
      'Owned SAP B1 / HANA extraction patterns, star-schema modeling, and DAX/Deneb (Vega) visualizations.',
    ],
    bulletsEs: [
      'Entregué pipelines ELT empresariales y modelos semánticos de Power BI para clientes de finanzas, ventas y operaciones (Bag, Enaex, Janssen, Canontex).',
      'Fui responsable de los patrones de extracción de SAP B1 / HANA, el modelado en esquema estrella y las visualizaciones en DAX/Deneb (Vega).',
    ],
  },
  {
    title: 'Founder & Consultant',
    titleEs: 'Fundador y Consultor',
    org: 'Tucunar (independent)',
    dates: '2026 — Present',
    datesEs: '2026 — Presente',
    bullets: [
      'Run a technology-services practice end to end: client discovery, scoping and statements of work, then delivery of data, infrastructure and AI work for SMEs and mining clients.',
    ],
    bulletsEs: [
      'Dirijo una práctica de servicios tecnológicos de punta a punta: discovery con el cliente, alcance y SOW, y luego entrega de proyectos de datos, infraestructura e IA para PYMEs y clientes mineros.',
    ],
  },
];

export interface StackRow {
  key: string;
  keyEs: string;
  items: string;
}

export const stackRows: StackRow[] = [
  {
    key: 'warehouses',
    keyEs: 'warehouses',
    items: 'BigQuery · ClickHouse · DuckDB · Snowflake · SAP HANA · Apache Iceberg · Delta',
  },
  {
    key: 'orchestration',
    keyEs: 'orquestación',
    items: 'Custom (self-built) · Dagster · Prefect · dbt · dlt · Kafka',
  },
  {
    key: 'languages',
    keyEs: 'lenguajes',
    items: 'Python · Go · SQL · TypeScript · Node.js',
  },
  {
    key: 'infra',
    keyEs: 'infra',
    items: 'GCP · Docker · GitHub Actions · CI/CD · Linux · Tailscale',
  },
  {
    key: 'ai / agents',
    keyEs: 'ia / agentes',
    items: 'Claude Code · Agent Skills · MCP · Multi-agent orchestration · Claude Agent SDK (ACP) · LLMOps/observability',
  },
  {
    key: 'bi',
    keyEs: 'bi',
    items: 'Power BI · DAX · Deneb (Vega) · Plotly · D3.js',
  },
];
