/**
 * path.ts — where a page's social card lives.
 *
 * Kept separate from render.ts so components can compute the URL without
 * pulling satori, sharp and the font files into their module graph.
 */
export function ogImagePath(active: string, lang: string, slug?: string): string {
  if (active === 'blog') return slug ? `/og/blog/${slug}.png` : '/og/blog.png';
  return `/og/${active}-${lang}.png`;
}
