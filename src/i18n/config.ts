/**
 * config.ts — locale routing table and geo-detection constants.
 *
 * Kept free of UI strings so the inline <head> detection script can import
 * these values through `define:vars` without pulling the whole dictionary
 * into the HTML of every page.
 */

export const LOCALES = ['en', 'es'] as const;
export type Lang = (typeof LOCALES)[number];

export const DEFAULT_LANG: Lang = 'en';

/** Page keys shared by both locales. `blog` is deliberately untranslated. */
export type PageKey = 'cv' | 'projects' | 'blog' | 'contact';

/**
 * The URL of every page in every locale. English sits at the root; Spanish
 * lives under /es/ with translated slugs. The blog points at the same English
 * URL from both locales because the articles are not translated.
 */
export const routes: Record<PageKey, Record<Lang, string>> = {
  cv:       { en: '/',         es: '/es/' },
  projects: { en: '/projects', es: '/es/proyectos' },
  blog:     { en: '/blog',     es: '/blog' },
  contact:  { en: '/contact',  es: '/es/contacto' },
};

/** Home of each locale — where the language switch lands when a page has no
 *  counterpart, and where geo-detection sends a first-time visitor. */
export const home: Record<Lang, string> = { en: '/', es: '/es/' };

/**
 * Countries whose visitors get Spanish by default.
 *
 * The site copy is neutral formal Chilean Spanish, but any Spanish-speaking
 * visitor reads it more comfortably than English, so the whole set is included.
 */
export const SPANISH_COUNTRIES = [
  'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'ES', 'GQ',
  'GT', 'HN', 'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE',
];

/** localStorage keys. `choice` outranks every automatic signal, forever. */
export const STORAGE = {
  choice: 'ab:lang',
  geo: 'ab:geo',
} as const;

/** How long a cached IP-country verdict stays valid (30 days, in ms). */
export const GEO_TTL = 30 * 24 * 60 * 60 * 1000;

/** Reads the locale out of a pathname. Anything under /es/ is Spanish. */
export function langFromPath(pathname: string): Lang {
  return /^\/es(\/|$)/.test(pathname) ? 'es' : 'en';
}

/** BCP-47 tag for <html lang> and og:locale. */
export const htmlLang: Record<Lang, string> = { en: 'en', es: 'es-CL' };
export const ogLocale: Record<Lang, string> = { en: 'en_US', es: 'es_CL' };
