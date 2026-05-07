// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://alonsoburon.cl',
  base: '/',
  markdown: {
    shikiConfig: {
      theme: 'gruvbox-dark-hard',
      wrap: true,
    },
  },
});
