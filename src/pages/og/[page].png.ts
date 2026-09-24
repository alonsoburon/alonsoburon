/**
 * /og/[page].png — the social card for every non-article page, in both
 * locales. Rendered once at build time; the filename is referenced by the
 * og:image / twitter:image tags in Layout.astro.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgPng, type OgCard } from '../../og/render';
import type { Lang, PageKey } from '../../i18n/config';

type Page = Exclude<PageKey, 'blog'> | 'blog';

const cards: Record<Page, (lang: Lang) => OgCard> = {
  cv: (lang) => ({
    kicker: lang === 'es' ? 'perfil' : 'profile',
    title:
      lang === 'es'
        ? 'Alonso Burón — Líder de Ingeniería de Datos'
        : 'Alonso Burón — Lead Data Engineer',
    meta: lang === 'es' ? 'Warp · pipelines confiables · agentes de IA' : 'Warp · reliable pipelines · AI agents',
    path: '~/cv.md',
  }),
  experience: (lang) => ({
    kicker: lang === 'es' ? 'trayectoria' : 'work history',
    title: lang === 'es' ? 'Experiencia' : 'Experience',
    meta: lang === 'es' ? 'Datawalt · minería · BI' : 'Datawalt · mining · BI',
    path: lang === 'es' ? '~/experiencia.md' : '~/experience.md',
  }),
  projects: (lang) => ({
    kicker: lang === 'es' ? 'trabajo seleccionado' : 'selected work',
    title: lang === 'es' ? 'Proyectos' : 'Projects',
    meta: 'Warp · vintage · toka · libreGantt',
    path: lang === 'es' ? '~/proyectos.md' : '~/projects.md',
  }),
  contact: (lang) => ({
    kicker: lang === 'es' ? 'contacto' : 'get in touch',
    title: lang === 'es' ? 'Hablemos' : "Let's talk",
    meta: 'alonso.buron@proton.me',
    path: lang === 'es' ? '~/contacto.yml' : '~/contact.yml',
  }),
  blog: () => ({
    kicker: 'writing',
    title: 'Notes on data engineering',
    meta: 'reliable pipelines · agents · observability',
    path: '~/blog/',
  }),
};

const PAGES: Page[] = ['cv', 'experience', 'projects', 'contact', 'blog'];
const LANGS: Lang[] = ['en', 'es'];

export function getStaticPaths() {
  return PAGES.flatMap((page) =>
    page === 'blog'
      ? [{ params: { page: 'blog' }, props: { page, lang: 'en' as Lang } }]
      : LANGS.map((lang) => ({ params: { page: `${page}-${lang}` }, props: { page, lang } }))
  );
}

export const GET: APIRoute = async ({ props }) => {
  const { page, lang } = props as { page: Page; lang: Lang };
  const card = cards[page](lang);

  if (page === 'blog') {
    const posts = await getCollection('blog');
    card.meta = `${posts.length} articles on data engineering`;
  }

  const png = await renderOgPng(card);
  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
