import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { napkinKatexMacros } from './src/lib/katex-macros';

const katexOptions = { macros: napkinKatexMacros, strict: 'ignore' };

export default defineConfig({
  site: 'https://example.com',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, katexOptions]],
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, katexOptions]],
  },
});
