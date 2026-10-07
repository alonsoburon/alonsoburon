export type Category = 'work' | 'fun';
export type Source   = 'foss' | 'closed';

export interface Screenshot {
  src: string;
  alt: string;
}

export interface Project {
  category: Category;
  source: Source;
  /** Proper noun — never translated. */
  title: string;
  period: string;
  role: string;
  description: string;
  achievements: string[];
  tech?: string[];
  githubUrl?: string;
  homepage?: string;
  /** Screenshots shown as a gallery atop the project card. `src` is relative to /public. */
  screenshots?: Screenshot[];
  publishedAt?: Date;
  /** Surfaced on the home page as a selected project. */
  featured?: boolean;
  /** Kept in the data but hidden from the site (e.g. not ready to announce). */
  hidden?: boolean;
  /** Spanish overrides. A missing field falls back to the English one. */
  periodEs?: string;
  roleEs?: string;
  descriptionEs?: string;
  achievementsEs?: string[];
}

export const projects: Project[] = [
  // ────────────────────────────────────────────────────
  //  WORK · clients & employers (mostly closed-source)
  // ────────────────────────────────────────────────────
  {
    category: 'work',
    source: 'closed',
    title: 'Warp Data Platform',
    period: '2024-10 → now',
    role: 'Data Engineering Lead',
    description:
      'Enterprise EtLT platform unifying on-site and cloud systems for multiple production clients across Chile.',
    achievements: [
      'Unification of 150 data systems',
      'Simplified incremental loading',
    ],
    publishedAt: new Date('2024-10-01'),
    featured: true,
    periodEs: '2024-10 → ahora',
    roleEs: 'Líder de Ingeniería de Datos',
    descriptionEs:
      'Plataforma EtLT empresarial que unifica sistemas on-premise y en la nube para varios clientes en producción a lo largo de Chile.',
    achievementsEs: [
      'Unificación de más de 150 sistemas de datos',
      'Carga incremental simplificada',
    ],
  },
  {
    category: 'work',
    source: 'closed',
    title: 'HR Multi-Platform Integration',
    period: '2025-03 → 2025-09',
    role: 'Data Engineer',
    description:
      'Homogenizing data from multiple HR platforms (Talana, GeoVictoria, Buk, more) into a single star-schema for reporting.',
    achievements: [
      'Multi REST-API integration',
      'Custom gold views per stakeholder',
    ],
    publishedAt: new Date('2025-03-01'),
    roleEs: 'Ingeniero de Datos',
    descriptionEs:
      'Homogeneización de datos de varias plataformas de RRHH (Talana, GeoVictoria, Buk y otras) en un solo esquema estrella para reportería.',
    achievementsEs: [
      'Integración de múltiples APIs REST',
      'Vistas gold a medida por área',
    ],
  },
  {
    category: 'work',
    source: 'closed',
    title: 'Mining Analytics Platform',
    period: '2024-06 → 2025-06',
    role: 'BI Developer',
    description:
      'Deep visualization platform for a mining client — custom visuals and dashboards with row-level security.',
    achievements: ['Custom visuals', 'RLS-enforced dashboards'],
    publishedAt: new Date('2024-06-01'),
    roleEs: 'Desarrollador BI',
    descriptionEs:
      'Plataforma de visualización profunda para un cliente minero, con visualizaciones personalizadas y dashboards con seguridad a nivel de fila.',
    achievementsEs: ['Visualizaciones personalizadas', 'Dashboards con RLS'],
  },
  {
    category: 'work',
    source: 'closed',
    title: 'Financial Reporting Template',
    period: '2024-12 → 2025-03',
    role: 'BI Developer',
    description:
      'Parametrized Power BI template for SAP B1 — multi-source star schema for financial reporting.',
    achievements: ['Parametrized Power BI', 'SAP B1 multi-source'],
    publishedAt: new Date('2024-12-01'),
    roleEs: 'Desarrollador BI',
    descriptionEs:
      'Plantilla parametrizada de Power BI para SAP B1, con esquema estrella multi-fuente para reportería financiera.',
    achievementsEs: ['Power BI parametrizado', 'SAP B1 multi-fuente'],
  },
  {
    category: 'work',
    source: 'closed',
    title: 'Tucunar',
    period: '2026 → now',
    role: 'Founder',
    hidden: true,
    description:
      'Independent technology-services practice: discovery, scoping and delivery of data, infrastructure and AI work for SMEs and mining clients.',
    achievements: ['Client discovery & SOWs', 'Data · infra · AI delivery'],
    publishedAt: new Date('2026-01-05'),
    periodEs: '2026 → ahora',
    roleEs: 'Fundador',
    descriptionEs:
      'Práctica independiente de servicios tecnológicos: discovery, alcance y entrega de proyectos de datos, infraestructura e IA para PYMEs y clientes mineros.',
    achievementsEs: ['Discovery y SOW con clientes', 'Entrega de datos · infra · IA'],
  },
  // ────────────────────────────────────────────────────
  //  FUN · personal, portfolio & learning projects
  // ────────────────────────────────────────────────────
  {
    category: 'fun',
    source: 'foss',
    title: 'LedgerLab',
    period: '2026-09 → now',
    role: 'solo',
    description:
      'Banking ledger written four times (Python, Rust, C, COBOL), plus a load test that measures how many concurrent users each version holds.',
    achievements: [
      'One contract, four implementations',
      'Capacity search with warm-up, soak check and CPU numbers',
    ],
    tech: ['Python', 'Rust', 'C', 'COBOL', 'SQLite'],
    githubUrl: 'https://github.com/alonsoburon/ledgerlab',
    publishedAt: new Date('2026-09-29'),
    featured: true,
    periodEs: '2026-09 → ahora',
    descriptionEs:
      'Backend bancario escrito cuatro veces (Python, Rust, C, COBOL), más una prueba de carga que mide cuántos usuarios concurrentes aguanta cada versión.',
    achievementsEs: [
      'Un contrato, cuatro implementaciones',
      'Búsqueda de capacidad con warm-up, verificación soak y CPU',
    ],
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'libreKanban',
    period: '2026-09 → now',
    role: 'solo',
    description:
      'Self-hosted Trello-style boards: a vendored fork of Kan (AGPL-3.0) with a Trello look, board backgrounds, card modals and Garage instead of MinIO for attachments.',
    achievements: ['Trello-style UI on top of Kan', 'Self-hosted with Podman + Postgres'],
    tech: ['TypeScript', 'Next.js', 'tRPC', 'Drizzle', 'PostgreSQL'],
    screenshots: [
      { src: '/screenshots/kanban/kanban-01-board.png', alt: 'libreKanban board with lists, labels and due dates' },
      { src: '/screenshots/kanban/kanban-02-card.png', alt: 'Card opened as a modal over the board' },
    ],
    publishedAt: new Date('2026-09-30'),
    periodEs: '2026-09 → ahora',
    descriptionEs:
      'Tableros estilo Trello autoalojados: fork vendorizado de Kan (AGPL-3.0) con aspecto Trello, fondos de tablero, tarjetas en modal y Garage en vez de MinIO para adjuntos.',
    achievementsEs: ['UI estilo Trello sobre Kan', 'Autoalojado con Podman + Postgres'],
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'vintage',
    period: '2026-09 → now',
    role: 'solo',
    description:
      'Point-in-time macroeconomic data for Chile, exposed as an open REST API and an MCP server so AI agents can query series without look-ahead bias.',
    achievements: ['MCP server for agents', 'Point-in-time vintages'],
    tech: ['TypeScript', 'MCP', 'REST', 'Vercel'],
    githubUrl: 'https://github.com/alonsoburon/vintage',
    homepage: 'https://vintage.nuxapower.cl',
    screenshots: [
      { src: '/screenshots/vintage/vintage-01-home.png', alt: 'vintage landing page with the vintage explorer' },
      { src: '/screenshots/vintage/vintage-02-explorer.png', alt: 'Copper price series with the point-in-time date slider' },
    ],
    publishedAt: new Date('2026-09-21'),
    featured: true,
    periodEs: '2026-09 → ahora',
    descriptionEs:
      'Datos macroeconómicos point-in-time de Chile, expuestos como API REST abierta y servidor MCP para que agentes de IA consulten series sin look-ahead bias.',
    achievementsEs: ['Servidor MCP para agentes', 'Vintages point-in-time'],
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'toka',
    period: '2026-09 → now',
    role: 'solo',
    description:
      'Shared household chores: an offline-first Android client over Firebase Auth + Firestore, with security rules as the only boundary between homes.',
    achievements: [
      'Offline-first Android',
      'Firestore rules as tenant boundary',
      'Idempotent client-side recurrence',
    ],
    tech: ['Kotlin', 'Jetpack Compose', 'Firebase', 'Firestore'],
    githubUrl: 'https://github.com/alonsoburon/toka',
    screenshots: [
      { src: '/screenshots/toka/toka-01-dashboard.png', alt: 'Toka dashboard listing pending household tasks' },
      { src: '/screenshots/toka/toka-02-taskdetail.png', alt: 'Task detail with due date, reminders and recurrence' },
      { src: '/screenshots/toka/toka-03-plantillas.png', alt: 'Task templates that regenerate on completion' },
      { src: '/screenshots/toka/toka-04-historial.png', alt: 'History of completed tasks' },
      { src: '/screenshots/toka/toka-05-personas.png', alt: 'People in the household and their invite code' },
      { src: '/screenshots/toka/toka-06-widget.png', alt: 'Toka home-screen widget' },
    ],
    publishedAt: new Date('2026-09-20'),
    periodEs: '2026-09 → ahora',
    descriptionEs:
      'Tareas domésticas compartidas: cliente Android offline-first sobre Firebase Auth + Firestore, con reglas de seguridad como única frontera entre hogares.',
    achievementsEs: [
      'Android offline-first',
      'Reglas Firestore como frontera entre hogares',
      'Recurrencia idempotente en cliente',
    ],
  },
  {
    category: 'fun',
    source: 'closed',
    title: 'Finanzas',
    period: '2026-10',
    role: 'solo',
    description:
      'Private household finance app for a couple: quick entry, budgets with a traffic-light indicator and a launcher widget — offline-first over Firebase.',
    achievements: ['Offline-first sync', 'Launcher widget', 'CSV export'],
    tech: ['Kotlin', 'Jetpack Compose', 'Hilt', 'Firebase'],
    screenshots: [
      { src: '/screenshots/finance/finance-01-ingreso.png', alt: 'Finanzas quick-entry screen with a custom keypad' },
      { src: '/screenshots/finance/finance-02-movimientos.png', alt: 'Transactions grouped by day with monthly totals' },
      { src: '/screenshots/finance/finance-03-presupuesto.png', alt: 'Monthly budget per category with traffic-light bars' },
      { src: '/screenshots/finance/finance-04-resumen.png', alt: 'Monthly summary: income, expenses and spending by category' },
    ],
    publishedAt: new Date('2026-10-04'),
    periodEs: '2026-10',
    descriptionEs:
      'App privada de finanzas para una pareja: ingreso rápido, presupuestos con semáforo y widget de launcher — offline-first sobre Firebase.',
    achievementsEs: ['Sincronización offline-first', 'Widget de launcher', 'Exportar CSV'],
  },
  {
    category: 'fun',
    source: 'closed',
    title: 'buzz-selfhost',
    period: '2026-07',
    role: 'solo',
    description:
      'Notes and scripts to self-host an agent workspace on Linux, pairing a cheap agent (DeepSeek) with a frontier agent (Claude) behind a shared relay with per-agent identity and access gates.',
    achievements: ['Multi-agent orchestration', 'Cost-tiered agents'],
    tech: ['Nostr', 'ACP', 'Docker', 'Linux'],
    publishedAt: new Date('2026-07-27'),
    featured: true,
    periodEs: '2026-07',
    descriptionEs:
      'Notas y scripts para self-hostear un workspace de agentes en Linux, conectando un agente barato (DeepSeek) con uno de frontera (Claude) tras un relay común, con identidad y control de acceso por agente.',
    achievementsEs: ['Orquestación multi-agente', 'Agentes por nivel de costo'],
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'retro-skill',
    period: '2026-09',
    role: 'contributor',
    description:
      'Contributed an opencode transcript adapter to netresearch/retro-skill, an LLM-driven session retrospection skill for Claude Code.',
    achievements: ['FOSS contribution', 'opencode transcript adapter'],
    tech: ['Claude Code', 'Python', 'opencode'],
    githubUrl: 'https://github.com/netresearch/retro-skill',
    publishedAt: new Date('2026-09-18'),
    periodEs: '2026-09',
    roleEs: 'contribuidor',
    descriptionEs:
      'Contribuí un adaptador de transcripts de opencode a netresearch/retro-skill, un skill de retrospectiva de sesiones para Claude Code.',
    achievementsEs: ['Contribución FOSS', 'Adaptador de transcripts de opencode'],
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'libreGantt',
    period: '2026-04 → now',
    role: 'solo',
    description:
      'Local-first Gantt chart editor — no login, no backend, fully persisted in the browser.',
    achievements: [],
    tech: ['TypeScript', 'Next.js', 'React'],
    githubUrl: 'https://github.com/alonsoburon/libreGantt',
    homepage: 'https://gantt.nuxapower.cl',
    screenshots: [
      { src: '/screenshots/gantt/gantt-01-dias.png', alt: 'libreGantt day view with groups, dependencies and costs' },
      { src: '/screenshots/gantt/gantt-02-semanas.png', alt: 'libreGantt week view with a milestone' },
    ],
    publishedAt: new Date('2026-04-28'),
    periodEs: '2026-04 → ahora',
    descriptionEs:
      'Editor de cartas Gantt local-first: sin cuenta, sin backend, todo persistido en el navegador.',
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'ecl-skill',
    period: '2026-04',
    role: 'solo',
    description:
      'Claude agent skill that teaches production data-pipeline reliability patterns.',
    descriptionEs:
      'Agent skill de Claude que enseña patrones de confiabilidad para pipelines de datos en producción.',
    achievements: [],
    tech: ['Claude Skills', 'Markdown'],
    githubUrl: 'https://github.com/alonsoburon/ecl-skill',
    publishedAt: new Date('2026-04-13'),
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'waybar-peek',
    period: '2026-03',
    role: 'solo',
    description:
      'Auto-hide Waybar for Hyprland with a Super-key peek.',
    descriptionEs:
      'Waybar que se oculta solo en Hyprland y aparece al presionar la tecla Super.',
    achievements: [],
    tech: ['Python', 'Hyprland'],
    githubUrl: 'https://github.com/alonsoburon/waybar-peek',
    publishedAt: new Date('2026-03-28'),
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'libro_el',
    period: '2026-03 → now',
    role: 'solo',
    description:
      'Personal book / long-form writing project typeset in Typst.',
    periodEs: '2026-03 → ahora',
    descriptionEs:
      'Libro personal de escritura extensa, compuesto tipográficamente en Typst.',
    achievements: [],
    tech: ['Typst'],
    githubUrl: 'https://github.com/alonsoburon/libro_el',
    publishedAt: new Date('2026-03-16'),
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'toca',
    period: '2026-01',
    role: 'solo',
    description:
      'Tody-style household-chores PWA — local-first, offline-friendly.',
    descriptionEs:
      'PWA de tareas del hogar al estilo Tody: local-first y funcional sin conexión.',
    achievements: [],
    tech: ['React', 'TypeScript', 'Dexie.js'],
    githubUrl: 'https://github.com/alonsoburon/toca',
    publishedAt: new Date('2026-01-24'),
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'chess-rs',
    period: '2026-01',
    role: 'solo',
    description:
      'Chess game with an AI opponent — written in Rust to learn the language.',
    descriptionEs:
      'Juego de ajedrez con oponente de IA, escrito en Rust para aprender el lenguaje.',
    achievements: [],
    tech: ['Rust'],
    githubUrl: 'https://github.com/alonsoburon/chess-rs',
    publishedAt: new Date('2026-01-24'),
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'Real-time E-commerce Analytics',
    period: 'Portfolio · 2025-10',
    role: 'solo',
    description:
      'Real-time streaming analytics with Kafka, anomaly detection, and an interactive Streamlit dashboard.',
    achievements: ['Real-time processing', 'Anomaly detection'],
    periodEs: 'Portafolio · 2025-10',
    descriptionEs:
      'Analítica de streaming en tiempo real con Kafka, detección de anomalías y un dashboard interactivo en Streamlit.',
    achievementsEs: ['Procesamiento en tiempo real', 'Detección de anomalías'],
    tech: ['Kafka', 'Streamlit', 'SQLite', 'Parquet'],
    githubUrl: 'https://github.com/alonsoburon/portfolio-streaming',
    publishedAt: new Date('2025-10-26'),
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'NYC Taxi Analytics Pipeline',
    period: 'Portfolio · 2025-10',
    role: 'solo',
    description:
      'Medallion-architecture batch ELT with Dagster, dlt, dbt, DuckDB and Plotly storytelling on top.',
    achievements: ['Medallion architecture', 'Dynamic viz'],
    periodEs: 'Portafolio · 2025-10',
    descriptionEs:
      'ELT por lotes con arquitectura medallion en Dagster, dlt, dbt y DuckDB, con narrativa visual en Plotly.',
    achievementsEs: ['Arquitectura medallion', 'Visualización dinámica'],
    tech: ['Dagster', 'dlt', 'dbt', 'DuckDB', 'Plotly'],
    githubUrl: 'https://github.com/alonsoburon/portfolio-batchElt',
    publishedAt: new Date('2025-10-10'),
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'Waltiliga Ajedrez',
    period: '2025-01',
    role: 'solo',
    description:
      'Chess-league tracker site for a friends’ tournament.',
    descriptionEs:
      'Sitio para seguir una liga de ajedrez en un torneo entre amigos.',
    achievements: [],
    tech: ['TypeScript', 'Next.js'],
    githubUrl: 'https://github.com/alonsoburon/waltiliga_ajedrez',
    homepage: 'https://waltiliga-ajedrez.vercel.app',
    publishedAt: new Date('2025-01-19'),
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'Habit Tracker',
    period: '2024-08',
    role: 'solo · school',
    description:
      'Habit tracker built for IU International Hochschule coursework.',
    achievements: [],
    tech: ['Python'],
    githubUrl: 'https://github.com/alonsoburon/habit_tracker',
    publishedAt: new Date('2024-08-05'),
    roleEs: 'solo · universidad',
    descriptionEs:
      'Seguidor de hábitos hecho para un curso de IU International Hochschule.',
  },
];

/**
 * Resolves a project into one language. Spanish falls back to the English
 * field when no override exists, so a new project renders in both locales
 * the moment it is added.
 */
export function localizeProject(p: Project, lang: 'en' | 'es') {
  if (lang === 'en') {
    return {
      period: p.period,
      role: p.role,
      description: p.description,
      achievements: p.achievements,
    };
  }
  return {
    period: p.periodEs ?? p.period,
    role: p.roleEs ?? p.role,
    description: p.descriptionEs ?? p.description,
    achievements: p.achievementsEs ?? p.achievements,
  };
}

// ── Back-compat helpers ──────────────────────────────
export const closedSourceProjects = projects.filter((p) => p.category === 'work' && !p.hidden);
export const openSourceProjects   = projects.filter((p) => p.category === 'fun' && !p.hidden);
