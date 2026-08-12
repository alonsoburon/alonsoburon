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
    nav: { cv: 'cv', projects: 'projects', blog: 'blog', contact: 'contact' },
    /** Breadcrumb text. Segments double as URL slugs — see Layout.astro. */
    path: { cv: '~/cv.md', projects: '~/projects.md', blog: '~/blog/', contact: '~/contact.yml' },
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
      ledeAfterLink: ', classically trained composer, running on an Arch pendrive. Developing a big data platform that consolidates',
      ledeCode: '60+ enterprise systems',
      ledeTail: 'into multiple data warehouses.',

      currently: 'Currently',
      currentlySince: 'since 2024-10',
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
        building: '["Warp" · "ECL Framework" · "Competing with Fivetran"]',
        favoriteRdb: 'PostgreSQL for row-based, CH for columnar',
      },

      stack: 'Stack',
      stackNote: 'top of mind',
      stackKeys: {
        warehouses: 'warehouses',
        orchestration: 'orchestration',
        languages: 'languages',
        tooling: 'tooling',
      },

      education: 'Education',
      educationFile: 'education.yml',
      eduKeys: {
        composition: 'composition:',
        dataScience: 'data_science:',
        bsc: 'bsc_data_sci:',
      },
      eduValues: {
        composition: 'PUCCh · Music Composition',
        dataScience: 'PUCCh · Data Science Diploma',
        bsc: 'IU International · Data Scientist',
        bscNote: '// 2024-2026 (Incomplete)',
      },

      recentWritingA: 'Recent',
      recentWritingB: 'writing',
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
    nav: { cv: 'cv', projects: 'proyectos', blog: 'blog', contact: 'contacto' },
    path: { cv: '~/cv.md', projects: '~/proyectos.md', blog: '~/blog/', contact: '~/contacto.yml' },
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
      ledeAfterLink: ', compositor de formación clásica, con Arch en un pendrive. Desarrollo una plataforma de big data que consolida',
      ledeCode: 'más de 60 sistemas empresariales',
      ledeTail: 'en múltiples data warehouses.',

      currently: 'Actualmente',
      currentlySince: 'desde 2024-10',
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
        building: '["Warp" · "Framework ECL" · "Competencia a Fivetran"]',
        favoriteRdb: 'PostgreSQL para filas, CH para columnas',
      },

      stack: 'Stack',
      stackNote: 'lo que más uso',
      stackKeys: {
        warehouses: 'warehouses',
        orchestration: 'orquestación',
        languages: 'lenguajes',
        tooling: 'herramientas',
      },

      education: 'Educación',
      educationFile: 'educacion.yml',
      eduKeys: {
        composition: 'composicion:',
        dataScience: 'ciencia_de_datos:',
        bsc: 'bsc_ciencia_datos:',
      },
      eduValues: {
        composition: 'PUCCh · Composición Musical',
        dataScience: 'PUCCh · Diplomado en Data Science',
        bsc: 'IU International · Data Scientist',
        bscNote: '// 2024-2026 (incompleto)',
      },

      recentWritingA: 'Escritos',
      recentWritingB: 'recientes',
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
  en: 'Alonso Burón is a Lead Data Engineer in Santiago, Chile — architect of Warp, an EtLT platform consolidating 60+ enterprise systems into BigQuery and ClickHouse, and author of the ECL framework.',
  es: 'Alonso Burón es Líder de Ingeniería de Datos en Santiago, Chile. Es el arquitecto de Warp, una plataforma EtLT que consolida más de 60 sistemas empresariales en BigQuery y ClickHouse, y el autor del framework ECL.',
};
