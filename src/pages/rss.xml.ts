import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, identity } from '../data/profile';

const escape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Feed readers and several AI crawlers discover new writing here first. */
export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  const items = posts.map((p) =>
    [
      '    <item>',
      `      <title>${escape(p.data.title)}</title>`,
      `      <link>${SITE}/blog/${p.slug}</link>`,
      `      <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>`,
      `      <pubDate>${new Date(p.data.date).toUTCString()}</pubDate>`,
      `      <dc:creator>${escape(identity.name)}</dc:creator>`,
      ...(p.data.description
        ? [`      <description>${escape(p.data.description)}</description>`]
        : []),
      ...(p.data.tags ?? []).map((t) => `      <category>${escape(t)}</category>`),
      '    </item>',
    ].join('\n')
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escape(identity.name)} — Writing</title>`,
    `    <link>${SITE}/blog</link>`,
    `    <description>${escape(identity.definitionEn)}</description>`,
    '    <language>en</language>',
    `    <managingEditor>${identity.email} (${escape(identity.name)})</managingEditor>`,
    `    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
