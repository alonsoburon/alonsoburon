export type Category = 'work' | 'fun';
export type Source   = 'foss' | 'closed';

export interface Project {
  category: Category;
  source: Source;
  title: string;
  period: string;
  role: string;
  description: string;
  achievements: string[];
  tech?: string[];
  githubUrl?: string;
  homepage?: string;
  publishedAt?: Date;
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
  },
  {
    category: 'fun',
    source: 'foss',
    title: 'ecl-skill',
    period: '2026-04',
    role: 'solo',
    description:
      'Claude agent skill that teaches ECL (Extract, Conform, Load) data pipeline patterns.',
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
  },
];

// ── Back-compat helpers ──────────────────────────────
export const closedSourceProjects = projects.filter((p) => p.category === 'work');
export const openSourceProjects   = projects.filter((p) => p.category === 'fun');
