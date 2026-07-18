import { test, expect } from '@playwright/test';

const BASE = '/part-13-riemann-surfaces/06-line-bundles';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Line bundles — KaTeX renders', () => {
  test('formal definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-definition/02-formal-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow — overview MCQ ───────────────────────────────────────────────────
test.describe('Line bundles — MCQ flow (what distinguishes a section)', () => {
  const SLIDE = `${BASE}/01-overview/02-road-map`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#rs52-overview-mcq-what-distinguishes`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /The 'graph paper' is twisted/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /It maps into a higher-dimensional space/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow — fiber dimension ───────────────────────────────────────
test.describe('Line bundles — NumericInput flow (fiber dimension)', () => {
  const SLIDE = `${BASE}/03-visualizing-a-line-bundle/06-vector-space-structure`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#rs52-viz-num-fiber-dimension`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('2');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('1');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('1');
  });
});

// ── ProofReveal flow — nonzero scaling proof ──────────────────────────────────
test.describe('Line bundles — ProofReveal flow (nonzero scaling for isomorphisms)', () => {
  const SLIDE = `${BASE}/04-morphisms-between-line-bundles/02-nonzero-exercise`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#rs52-morph-proof-nonzero`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/g\(p\)·f\(p\) = 1/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/g\(p\)·f\(p\) = 1/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/g\(p\)·f\(p\) = 1/i)).toBeVisible();
  });
});
