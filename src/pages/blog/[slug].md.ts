import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, identity } from '../../data/profile';

/**
 * /blog/<slug>.md — raw markdown mirror of each article.
 *
 * A separate URL, not a user-agent swap: no cloaking, and crawlers that
 * prefer markdown over rendered HTML get clean prose with the author and
 * canonical URL attached to every chunk.
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');
  return posts.map((post) => ({ params: { slug: post.slug }, props: { post } }));
};

export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getCollection<'blog'>>>[number] };

  const body = [
    `# ${post.data.title}`,
    '',
    `- Author: ${identity.name} (${identity.jobTitle}, ${identity.city}, ${identity.country})`,
    `- Published: ${post.data.date}`,
    `- Canonical URL: ${SITE}/blog/${post.slug}`,
    ...(post.data.description ? [`- Summary: ${post.data.description}`] : []),
    ...(post.data.tags?.length ? [`- Tags: ${post.data.tags.join(', ')}`] : []),
    '',
    '---',
    '',
    post.body.replace(/<\/?span[^>]*>/g, '').trim(),
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
