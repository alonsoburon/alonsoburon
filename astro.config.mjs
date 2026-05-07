// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://alonsoburon.cl',
  base: '/',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
      transformers: [
        {
          name: 'custom-code-block',
          pre(node) {
            node.properties.style = 'background: #010409; border-radius: 1rem; padding: 2rem; margin: 1.5rem 0; overflow-x: auto; font-family: "JetBrains Mono", "Menlo", "Ubuntu Mono", monospace; font-size: 0.875rem; line-height: 1.4; box-shadow: 0 4px 6px rgba(0,0,0,0.4); counter-reset: line;';
            node.properties.class = (node.properties.class || '') + ' line-numbers';
          },
          code(node) {
            node.properties.style = 'background: none; padding: 0; color: #f0f6fc; border: none; display: block; margin: 0; line-height: 1.4;';
          },
          span(node) {
            // Target spans with 'line' class for line numbering
            if (node.properties.class && typeof node.properties.class === 'string' && node.properties.class.includes('line')) {
              node.properties.style = 'display: block; counter-increment: line; position: relative; padding-left: 3rem;';
              node.properties['data-line'] = 'true';
            }
          }
        }
      ]
    }
  }
});
