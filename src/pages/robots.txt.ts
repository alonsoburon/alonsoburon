import type { APIRoute } from 'astro';
import { SITE, aiCrawlers } from '../data/profile';

/**
 * robots.txt — explicitly opts every major AI/LLM crawler in.
 *
 * Several of these (Google-Extended, Applebot-Extended, CCBot) default to
 * "assume permission is withheld" in some publisher setups; naming them with
 * an explicit Allow removes any ambiguity. The llms.txt pointers are a
 * non-standard but widely-honored convention.
 */
export const GET: APIRoute = () => {
  const blocks = [
    'User-agent: *',
    'Allow: /',
    '',
    ...aiCrawlers.flatMap((ua) => [`User-agent: ${ua}`, 'Allow: /', '']),
    `Sitemap: ${SITE}/sitemap.xml`,
    '',
    '# Plain-text mirrors intended for language-model ingestion:',
    `# ${SITE}/llms.txt       — index and structured Q&A`,
    `# ${SITE}/llms-full.txt  — full text of every article`,
    `# ${SITE}/rss.xml        — article feed`,
    '',
  ];

  return new Response(blocks.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
