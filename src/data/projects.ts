export type Category = 'work' | 'fun';
export type Source   = 'foss' | 'closed';

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
  publishedAt?: Date;
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
      'Unification of 60+ data systems',
      'Simplified incremental loading',
    ],
    publishedAt: new Date('2024-10-01'),
    periodEs: '2024-10 → ahora',
    roleEs: 'Líder de Ingeniería de Datos',
    descriptionEs:
      'Plataforma EtLT empresarial que unifica sistemas on-premise y en la nube para varios clientes en producción a lo largo de Chile.',
    achievementsEs: [
      'Unificación de más de 60 sistemas de datos',
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
  // ────────────────────────────────────────────────────
  //  FUN · personal, portfolio & learning projects
  // ────────────────────────────────────────────────────
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
    homepage: 'https://libregantt.vercel.app',
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
      'Claude agent skill that teaches ECL (Extract, Conform, Load) data pipeline patterns.',
    descriptionEs:
      'Agent skill de Claude que enseña los patrones de pipelines de datos ECL (Extract, Conform, Load).',
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
export const closedSourceProjects = projects.filter((p) => p.category === 'work');
export const openSourceProjects   = projects.filter((p) => p.category === 'fun');
