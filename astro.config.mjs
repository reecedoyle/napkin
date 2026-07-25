import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import AstroPWA from '@vite-pwa/astro';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { napkinKatexMacros } from './src/lib/katex-macros';

// `output: 'html'` renders each formula once (the visible HTML) instead of the
// default 'htmlAndMathml', which also bakes a visually-hidden MathML copy into
// every page. With ~1275 KaTeX-heavy MDX modules all held in one Rollup graph
// during the build, that second copy pushed the peak heap past 4GB; dropping it
// cuts the build peak ~5.2GB → ~4.0GB (builds under a 4096 cap) with no visual
// change. Trade-off: screen readers no longer get semantic MathML.
const katexOptions = { macros: napkinKatexMacros, strict: 'ignore', output: 'html' };

// PUBLIC_BASE_PATH is set by the GH Pages workflow (e.g. "/napkin/").
// Always pass it with a trailing slash so `${BASE_URL}foo` concatenates
// cleanly in templates. Dev / preview / Playwright run with no base so
// existing tests stay at /.
const BASE_PATH = process.env.PUBLIC_BASE_PATH || undefined;
const SCOPE = BASE_PATH ?? '/';

// The PWA integration runs a workbox pass that precaches the whole dist/
// (~1300 entries) on every build. That's only needed for the deployed,
// installable site — it's dead weight for the build that feeds Playwright
// (and for `npm run dev`). Gate it behind ENABLE_PWA=1, which the GH Pages
// deploy workflow sets; local build / preview / e2e skip it and build faster.
// No e2e or unit test depends on the service worker or manifest.
const ENABLE_PWA = process.env.ENABLE_PWA === '1';

export default defineConfig({
  site: 'https://reecedoyle.github.io',
  base: BASE_PATH,
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, katexOptions]],
    }),
    ...(ENABLE_PWA ? [AstroPWA({
      registerType: 'autoUpdate',
      base: SCOPE,
      scope: SCOPE,
      manifest: {
        name: 'Napkin — Interactive Math',
        short_name: 'Napkin',
        description:
          "Slide-style interactive companion to Evan Chen's An Infinitely Large Napkin.",
        start_url: SCOPE,
        scope: SCOPE,
        display: 'standalone',
        background_color: '#1c1917',
        theme_color: '#1c1917',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'pwa-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Cache the whole built site plus the manifest/icons so first launch
        // works offline after install. `glob` runs against the dist/ output.
        globPatterns: ['**/*.{html,js,css,png,jpg,jpeg,svg,webp,woff,woff2,ico,webmanifest}'],
        // Single-page fallback so deep links work offline. Resolve to the
        // home page within the scope.
        navigateFallback: SCOPE,
        // Don't precache anything > 4 MB (KaTeX fonts sit comfortably under).
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    })] : []),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, katexOptions]],
  },
});
