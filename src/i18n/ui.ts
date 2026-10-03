/**
 * ui.ts — every visible string, in both locales.
 *
 * Spanish is neutral formal Chilean: `tú` and impersonal forms, never voseo.
 * Technical names (BigQuery, ClickHouse, EtLT, staging swap) stay in English
 * because that is how they are spoken in the trade.
 *
 * The blog is not translated. Nothing under src/content/blog or the blog
 * pages reads from this file.
 */
import type { Lang } from './config';

export const ui = {
  en: {
    /* ── chrome ─────────────────────────────────────── */
    nav: { cv: 'cv', experience: 'experience', projects: 'projects', blog: 'blog', contact: 'contact' },
    /** Breadcrumb text. Segments double as URL slugs — see Layout.astro. */
    path: { cv: '~/cv.md', experience: '~/experience.md', projects: '~/projects.md', blog: '~/blog/', contact: '~/contact.yml' },
    lang: {
      label: 'lang:',
      en: 'en',
      es: 'es',
      switchTo: 'Read this site in Spanish',
      current: 'Currently reading in English',
      blogOnlyEn: 'The blog is written in English only',
    },
    foot: { rendered: 'rendered', transitions: 'view-transitions: on', copy: '©2026 Burón · MIT' },

    /* ── home / cv ──────────────────────────────────── */
    home: {
      title: 'Alonso Burón — Lead Data Engineer in Santiago, Chile',
      ledeRole: 'Lead Data Engineer at',
      ledeAfterLink: ", classically trained composer and FOSS enthusiast. Developing a Fivetran alternative that's",
      ledeCode: '>100x cheaper',
      ledeTail: '.',

      currently: 'Currently',
      currentlySince: 'since 2024',
      currentFile: 'frontmatter · current.yml',
      k: {
        role: 'role:',
        company: 'company:',
        since: 'since:',
        building: 'building:',
        favoriteRdb: 'favorite RDB:',
      },
      v: {
        role: 'Data Engineering Lead',
        building: '["Automations" · "Reliable Architecture" · "Truly fast data pipelines"]',
        favoriteRdb: 'PostgreSQL for row-based, CH for columnar',
      },

      projectsTitle: 'Selected',
      projectsKey: 'projects',
      projectsAll: 'all projects',

      recentWritingA: 'Recent',
      recentWritingB: 'writing',
    },

    /* ── experience ─────────────────────────────────── */
    experience: {
      title: 'Experience — Alonso Burón',
      heading: 'Experience',
      stack: 'Stack',
    },

    /* ── projects ───────────────────────────────────── */
    projects: {
      title: 'Projects — Alonso Burón',
      heading: 'Projects',
      countWork: 'work',
      countFun: 'fun',
      countFoss: 'foss',
      countClosed: 'closed',
      filterType: '$ filter --type',
      filterSource: '$ filter --source',
      chipAll: '--all',
      chipWork: '--work',
      chipFun: '--fun',
      chipFoss: '--foss',
      chipClosed: '--closed',
      sort: 'sort:',
      sortDesc: 'recent ↓',
      sortAsc: 'recent ↑',
      role: 'role: ',
      github: 'github: ',
      live: 'live: ',
      /** Card-head badges for the category / source data values. */
      badge: { work: 'work', fun: 'fun', foss: 'foss', closed: 'closed' },
    },

    /* ── contact ────────────────────────────────────── */
    contact: {
      title: 'Contact — Alonso Burón',
      heading: 'Contact',
      lede: 'The fastest path is email. I read everything; I reply to most things within a week.',
      file: 'contact.yml',
      k: {
        email: 'email:',
        github: 'github:',
        linkedin: 'linkedin:',
        timezone: 'timezone:',
        availability: 'availability:',
      },
      availability: 'open to consulting · not full-time',
      noteA: 'every link above is a real',
      noteB: 'or',
      noteC: '— pick whichever fits.',
    },
  },

  es: {
    /* ── chrome ─────────────────────────────────────── */
    nav: { cv: 'cv', experience: 'experiencia', projects: 'proyectos', blog: 'blog', contact: 'contacto' },
    path: { cv: '~/cv.md', experience: '~/experiencia.md', projects: '~/proyectos.md', blog: '~/blog/', contact: '~/contacto.yml' },
    lang: {
      label: 'idioma:',
      en: 'en',
      es: 'es',
      switchTo: 'Leer este sitio en inglés',
      current: 'Estás leyendo en español',
      blogOnlyEn: 'El blog está escrito solo en inglés',
    },
    foot: { rendered: 'renderizado', transitions: 'view-transitions: on', copy: '©2026 Burón · MIT' },

    /* ── inicio / cv ────────────────────────────────── */
    home: {
      title: 'Alonso Burón — Líder de Ingeniería de Datos en Santiago, Chile',
      ledeRole: 'Líder de Ingeniería de Datos en',
      ledeAfterLink: ', compositor de formación clásica y entusiasta del FOSS. Desarrollando una alternativa a Fivetran que es',
      ledeCode: '>100x más barata',
      ledeTail: '.',

      currently: 'Actualmente',
      currentlySince: 'desde 2024',
      currentFile: 'frontmatter · actual.yml',
      k: {
        role: 'rol:',
        company: 'empresa:',
        since: 'desde:',
        building: 'construyendo:',
        favoriteRdb: 'RDB favorita:',
      },
      v: {
        role: 'Líder de Ingeniería de Datos',
        building: '["Automatizaciones" · "Arquitectura confiable" · "Pipelines de datos realmente rápidos"]',
        favoriteRdb: 'PostgreSQL para filas, CH para columnas',
      },

      projectsTitle: 'Proyectos',
      projectsKey: 'destacados',
      projectsAll: 'todos los proyectos',

      recentWritingA: 'Escritos',
      recentWritingB: 'recientes',
    },

    /* ── experiencia ────────────────────────────────── */
    experience: {
      title: 'Experiencia — Alonso Burón',
      heading: 'Experiencia',
      stack: 'Stack',
    },

    /* ── proyectos ──────────────────────────────────── */
    projects: {
      title: 'Proyectos — Alonso Burón',
      heading: 'Proyectos',
      countWork: 'trabajo',
      countFun: 'personal',
      countFoss: 'foss',
      countClosed: 'cerrado',
      filterType: '$ filtrar --tipo',
      filterSource: '$ filtrar --fuente',
      chipAll: '--todo',
      chipWork: '--trabajo',
      chipFun: '--personal',
      chipFoss: '--foss',
      chipClosed: '--cerrado',
      sort: 'orden:',
      sortDesc: 'reciente ↓',
      sortAsc: 'reciente ↑',
      role: 'rol: ',
      github: 'github: ',
      live: 'en vivo: ',
      badge: { work: 'trabajo', fun: 'personal', foss: 'foss', closed: 'cerrado' },
    },

    /* ── contacto ───────────────────────────────────── */
    contact: {
      title: 'Contacto — Alonso Burón',
      heading: 'Contacto',
      lede: 'La vía más rápida es el correo electrónico. Leo todo y respondo la mayoría en menos de una semana.',
      file: 'contacto.yml',
      k: {
        email: 'correo:',
        github: 'github:',
        linkedin: 'linkedin:',
        timezone: 'zona_horaria:',
        availability: 'disponibilidad:',
      },
      availability: 'abierto a consultorías · no a jornada completa',
      noteA: 'cada enlace de arriba es un',
      noteB: 'o un',
      noteC: 'real. Usa el que prefieras.',
    },
  },
} as const;

/** Typed accessor for the dictionary of one locale. */
export function useUi(lang: Lang) {
  return ui[lang];
}

/** Meta description per locale. Feeds <meta name="description"> and og. */
export const metaDescription: Record<Lang, string> = {
  en: 'Alonso Burón is a Lead Data Engineer in Santiago, Chile — architect of Warp, an EtLT platform that replaces Fivetran at >100x lower cost, and a builder of reliable data platforms and agentic systems with MCP servers, Agent Skills and multi-agent orchestration. He writes about what stays hard now that AI writes pipeline code.',
  es: 'Alonso Burón es Líder de Ingeniería de Datos en Santiago, Chile. Es el arquitecto de Warp, una plataforma EtLT que reemplaza a Fivetran a >100x menos costo, y construye plataformas de datos confiables y sistemas agénticos con servidores MCP, Agent Skills y orquestación multi-agente. Escribe sobre lo que sigue siendo difícil ahora que la IA escribe el código de los pipelines.',
};
