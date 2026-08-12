import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../data/profile';
import { routes, type PageKey } from '../i18n/config';

/** Hand-rolled to avoid a dependency; the site is small enough that the
 *  integration would cost more than it saves. */
export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');

  interface Entry {
    loc: string;
    lastmod?: string;
    priority: string;
    /** Emitted as xhtml:link alternates so each locale points at the other. */
    alternates?: PageKey;
  }

  const entries: Entry[] = [
    // Both locales of every translated page. Each carries the full alternate
    // set, which is what Google requires: the links must be reciprocal.
    { loc: `${SITE}${routes.cv.en}`,       priority: '1.0', alternates: 'cv' },
    { loc: `${SITE}${routes.cv.es}`,       priority: '1.0', alternates: 'cv' },
    { loc: `${SITE}${routes.projects.en}`, priority: '0.8', alternates: 'projects' },
    { loc: `${SITE}${routes.projects.es}`, priority: '0.8', alternates: 'projects' },
    { loc: `${SITE}${routes.contact.en}`,  priority: '0.6', alternates: 'contact' },
    { loc: `${SITE}${routes.contact.es}`,  priority: '0.6', alternates: 'contact' },
    // The blog is English-only: one URL, no alternates.
    { loc: `${SITE}/blog`, priority: '0.8' },
    ...posts.map((p) => ({
      loc: `${SITE}/blog/${p.slug}`,
      lastmod: p.data.date,
      priority: '0.7',
    })),
  ];

  const altLinks = (page: PageKey) =>
    [
      `    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${routes[page].en}"/>`,
      `    <xhtml:link rel="alternate" hreflang="es" href="${SITE}${routes[page].es}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${routes[page].en}"/>`,
    ].join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries.map((e) =>
      [
        '  <url>',
        `    <loc>${e.loc}</loc>`,
        ...(e.lastmod ? [`    <lastmod>${e.lastmod}</lastmod>`] : []),
        `    <priority>${e.priority}</priority>`,
        ...(e.alternates ? [altLinks(e.alternates)] : []),
        '  </url>',
      ].join('\n')
    ),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
