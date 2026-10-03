/**
 * /og/blog/[slug].png — one social card per article, titled with the post
 * itself so every shared link previews its own headline.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgPng } from '../../../og/render';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({ params: { slug: post.slug }, props: { post } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: { slug: string; body: string; data: { title: string; date: string; tags?: string[] } } };

  const words = post.body ? post.body.split(/\s+/).length : 0;
  const readMin = Math.max(1, Math.round(words / 220));
  const tags = post.data.tags?.length ? ` · ${post.data.tags.map((t) => `#${t}`).join(' ')}` : '';

  const png = await renderOgPng({
    kicker: 'blog',
    title: post.data.title,
    meta: `${post.data.date} · ${readMin} min read${tags}`,
    path: `~/blog/${post.slug}.md`,
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
