// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Markdown tables are mono-spaced and often wider than a phone viewport.
 * Wrapping each one in a focusable scroll container keeps the table's own
 * column layout intact while confining the overflow to that box, instead of
 * letting it push the whole page sideways.
 */
function rehypeTableScroll() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children.forEach((child, i) => {
        if (child.type === 'element' && child.tagName === 'table') {
          // .table-wrap is the positioning context for the "more to the
          // right" fade; .table-scroll is the scroll port itself.
          node.children[i] = {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-wrap'] },
            children: [
              {
                type: 'element',
                tagName: 'div',
                properties: {
                  className: ['table-scroll'],
                  role: 'region',
                  tabIndex: 0,
                  'aria-label': 'Table — scroll horizontally to see all columns',
                },
                children: [child],
              },
            ],
          };
        } else {
          walk(child);
        }
      });
    };
    walk(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://alonsoburon.cl',
  base: '/',
  markdown: {
    shikiConfig: {
      theme: 'gruvbox-dark-hard',
      wrap: true,
    },
    rehypePlugins: [rehypeTableScroll],
  },
});
