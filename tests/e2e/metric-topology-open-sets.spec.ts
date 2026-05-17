import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/02-metric-topology/06-open-sets';

const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  { url: `${BASE}/01-r-neighborhoods`, heading: /r-neighborhoods/i },
  { url: `${BASE}/02-convergence-and-continuity-in-r-neighborhoods`, heading: /Convergence and continuity in r-neighborhood terms/i },
  { url: `${BASE}/03-open-sets`, heading: /^Open sets$/i },
  { url: `${BASE}/04-examples-and-non-examples`, heading: /Examples and non-examples/i },
  { url: `${BASE}/05-intersections-and-unions`, heading: /Intersections and unions of open sets/i },
  { url: `${BASE}/06-the-open-set-condition`, heading: /The open-set condition for continuity/i },
  { url: `${BASE}/07-proof-of-the-open-set-condition`, heading: /Proof of the open-set condition/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Metric topology · Open sets — slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

test.describe('Metric topology · Open sets — KaTeX renders', () => {
  test('open-sets definition slide renders KaTeX-formatted math', async ({ page }) => {
    await page.goto(`${BASE}/03-open-sets`);
    await expect(page.locator('.katex').first()).toBeVisible();
    await expect(page.locator('.katex-display').first()).toBeVisible();
  });
});

test.describe('Metric topology · Open sets — Figure renders', () => {
  test('r-neighborhoods slide renders the blob-and-circle figure', async ({ page }) => {
    await page.goto(`${BASE}/01-r-neighborhoods`);
    // The figure is wrapped in <figure role="figure"> with an aria-label
    // matching the alt text we supplied.
    await expect(page.getByRole('figure', { name: /blob labelled M/i })).toBeVisible();
    // And the SVG inside the figure should render.
    await expect(page.locator('figure svg').first()).toBeVisible();
  });
});

test.describe('Metric topology · Open sets — MCQ flow (not open in R)', () => {
  const SLIDE = `${BASE}/04-examples-and-non-examples`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#top-open-mcq-not-open-in-R`;

  test('correct answer is recorded and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /The closed interval \[0, 1\]/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:')).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /The open interval \(0, 1\)/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

test.describe('Metric topology · Open sets — ProofReveal flow (infinite intersection)', () => {
  const SLIDE = `${BASE}/05-intersections-and-unions`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#top-open-proof-infinite-intersection`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // Before reveal, the canonical answer (-1/n, 1/n) should not be visible.
    await expect(article.getByText(/Archimedean property/i)).toBeHidden();

    // There are two ProofReveals on this slide — pick the second button (the
    // one belonging to the infinite-intersection exercise).
    await page.getByRole('button', { name: /reveal solution/i }).nth(1).click();
    await expect(article.getByText(/Archimedean property/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Archimedean property/i)).toBeVisible();
  });
});
