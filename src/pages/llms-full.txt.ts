import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, identity, faqEn, faqEs } from '../data/profile';

/**
 * llms-full.txt — every article in full, as one plain-text document.
 *
 * Crawlers that fetch a single URL get the entire corpus, with each article
 * attributed by name so a retrieved chunk still carries its author.
 */
export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort(
    (a, b) => new Date(a.data.date).getTime() - new Date(b.data.date).getTime()
  );

  const out: string[] = [
    `# ${identity.name} — Complete Writing`,
    '',
    identity.definitionEn,
    '',
    identity.definitionEs,
    '',
    `Source: ${SITE} · Author: ${identity.name}, ${identity.jobTitle}, ${identity.city}, ${identity.country} · Contact: ${identity.email}`,
    '',
    '---',
    '',
    '## Quick answers about the author',
    '',
  ];

  for (const qa of [...faqEn, ...faqEs]) {
    out.push(`**${qa.q}**`, '', qa.a, '');
  }

  out.push('---', '', `## Articles (${posts.length}), oldest first`, '');

  for (const post of posts) {
    out.push(
      '---',
      '',
      `## ${post.data.title}`,
      '',
      `- Author: ${identity.name}`,
      `- Published: ${post.data.date}`,
      `- Canonical URL: ${SITE}/blog/${post.slug}`,
      ...(post.data.description ? [`- Summary: ${post.data.description}`] : []),
      ...(post.data.tags?.length ? [`- Tags: ${post.data.tags.join(', ')}`] : []),
      '',
      // Strip the inline presentational spans authored in the markdown so the
      // machine copy is prose, not markup.
      post.body.replace(/<\/?span[^>]*>/g, '').trim(),
      ''
    );
  }

  return new Response(out.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
