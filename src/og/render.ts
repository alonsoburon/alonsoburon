/**
 * render.ts — build-time social cards.
 *
 * Every page and every article gets a 1200×630 PNG in the site's own
 * terminal palette, so a shared link carries the brand instead of a bare
 * text preview. Satori lays the card out with the vendored JetBrains Mono
 * (subset to Latin, OFL — see ./fonts/OFL.txt) and emits an SVG of glyph
 * outlines; sharp rasterizes it. No system fonts are consulted, so the card
 * is byte-identical on a laptop and on CI.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// The endpoint is bundled into dist/chunks, so import.meta.url no longer
// points at src/. Dev and build both run from the project root, so resolve
// the vendored fonts against it instead.
const font = (file: string) => readFileSync(resolve(process.cwd(), 'src/og/fonts', file));
const regular = font('JetBrainsMono-Regular.ttf');
const bold = font('JetBrainsMono-Bold.ttf');

/** The exact gruvbox tokens from global.css. */
const C = {
  bg: '#1d2021',
  surface: '#22262a',
  border: '#32302f',
  text: '#ebdbb2',
  muted: '#a89984',
  dim: '#7c6f64',
  accent: '#fe8019',
  link: '#8ec07c',
  str: '#b8bb26',
} as const;

export interface OgCard {
  /** The headline. Wraps up to three lines and steps down in size. */
  title: string;
  /** The `# ` comment above the title, e.g. "blog" or "selected work". */
  kicker: string;
  /** Optional mono line under the title, e.g. date and reading time. */
  meta?: string;
  /** Breadcrumb shown top-left, e.g. "~/blog/0009_metadata_columns.md". */
  path?: string;
}

type Style = Record<string, string | number>;
interface Node {
  type: string;
  props: { style: Style; children?: string | number | Node[] };
}

const el = (type: string, style: Style, children?: string | number | Node[]): Node => ({
  type,
  props: { style, children },
});

/** Long headlines get a smaller face so they never overflow the card. */
function titleSize(title: string): number {
  const n = title.length;
  if (n > 84) return 42;
  if (n > 60) return 50;
  if (n > 38) return 58;
  return 66;
}

export async function renderOgPng(card: OgCard): Promise<Buffer> {
  const body: Node[] = [
    el('div', { display: 'flex', fontSize: 26, color: C.dim }, `# ${card.kicker}`),
    el(
      'div',
      {
        display: 'flex',
        fontSize: titleSize(card.title),
        fontWeight: 700,
        lineHeight: 1.15,
        color: C.text,
        maxWidth: 1040,
        overflow: 'hidden',
      },
      card.title
    ),
  ];
  if (card.meta) {
    body.push(el('div', { display: 'flex', fontSize: 26, color: C.muted }, card.meta));
  }

  const svg = await satori(
    el(
      'div',
      {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: C.bg,
        fontFamily: 'JBM',
        color: C.text,
      },
      [
        el(
          'div',
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
            padding: '0 56px',
            backgroundColor: C.surface,
            borderBottom: `1px solid ${C.border}`,
            fontSize: 24,
            flexShrink: 0,
          },
          [
            el('div', { display: 'flex', color: C.accent }, card.path ?? '~'),
            el('div', { display: 'flex', color: C.link }, 'alonsoburon.cl'),
          ]
        ),
        el(
          'div',
          {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flexGrow: 1,
            padding: '0 64px',
            gap: 24,
          },
          body
        ),
        el(
          'div',
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 72,
            padding: '0 56px',
            backgroundColor: C.surface,
            borderTop: `1px solid ${C.border}`,
            fontSize: 24,
            flexShrink: 0,
            color: C.muted,
          },
          [
            el('div', { display: 'flex' }, [
              el('div', { display: 'flex', color: C.str, marginRight: 12 }, '●'),
              el('div', { display: 'flex' }, 'Alonso Burón — Lead Data Engineer'),
            ]),
            el('div', { display: 'flex', color: C.dim }, 'Santiago, Chile'),
          ]
        ),
      ]
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts: [
        { name: 'JBM', data: regular, weight: 400, style: 'normal' },
        { name: 'JBM', data: bold, weight: 700, style: 'normal' },
      ],
    }
  );

  return sharp(Buffer.from(svg)).png().toBuffer();
}
