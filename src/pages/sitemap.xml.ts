import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../data/profile';

/** Hand-rolled to avoid a dependency; the site is small enough that the
 *  integration would cost more than it saves. */
export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');

  const entries: { loc: string; lastmod?: string; priority: string }[] = [
    { loc: `${SITE}/`, priority: '1.0' },
    { loc: `${SITE}/projects`, priority: '0.8' },
    { loc: `${SITE}/blog`, priority: '0.8' },
    { loc: `${SITE}/contact`, priority: '0.6' },
    ...posts.map((p) => ({
      loc: `${SITE}/blog/${p.slug}`,
      lastmod: p.data.date,
      priority: '0.7',
    })),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((e) =>
      [
        '  <url>',
        `    <loc>${e.loc}</loc>`,
        ...(e.lastmod ? [`    <lastmod>${e.lastmod}</lastmod>`] : []),
        `    <priority>${e.priority}</priority>`,
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
