import { test, expect } from '@playwright/test';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Dynamic render smoke test for every slide page.
//
// `npm run build` already statically renders all pages, so a page that
// fails to render fails the build. This spec adds the runtime half: each
// built page is actually served (200) and shows a non-empty <h1>. It
// replaces the ~497 hand-enumerated per-slide "loads URL + heading regex"
// tests that used to live in every chapter spec — those duplicated the
// build's render guarantee and their per-slide regexes were a recurring
// false-failure source.
//
// URLs are derived from src/pages (not dist/), because Playwright imports
// spec files to collect tests BEFORE the webServer build runs — dist/ may
// not exist yet at collection time, but the source always does. Astro's
// file-based routing maps src/pages/<…>/<slide>.mdx → /<…>/<slide>.

const PAGES_DIR = fileURLToPath(new URL('../../src/pages', import.meta.url));

function walkMdx(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkMdx(full));
    else if (entry.endsWith('.mdx')) out.push(full);
  }
  return out;
}

const slideUrls = walkMdx(PAGES_DIR)
  .map((f) => relative(PAGES_DIR, f))
  .filter((rel) => rel.startsWith(`part-`))
  .map((rel) => '/' + rel.replace(/\.mdx$/, '').split(sep).join('/'))
  .sort();

test.describe('All slide pages render (smoke)', () => {
  for (const url of slideUrls) {
    test(`renders ${url}`, async ({ page }) => {
      const resp = await page.goto(url);
      expect(resp?.status()).toBe(200);
      const h1 = page.getByRole('heading', { level: 1 }).first();
      await expect(h1).toBeVisible();
      expect((await h1.textContent())?.trim()).toBeTruthy();
    });
  }
});
