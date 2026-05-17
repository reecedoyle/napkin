import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/02-metric-topology/07-closed-sets';

const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  { url: `${BASE}/01-definition`, heading: /^Closed sets$/i },
  { url: `${BASE}/02-limit-points-and-closure`, heading: /Limit points and the closure/i },
  { url: `${BASE}/03-examples-and-non-examples`, heading: /Examples and non-examples/i },
  { url: `${BASE}/04-neither-and-both`, heading: /Neither open nor closed/i },
  { url: `${BASE}/05-complements-and-open-sets`, heading: /Closed sets are complements of open sets/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Metric topology · Closed sets — slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

test.describe('Metric topology · Closed sets — KaTeX renders', () => {
  test('definition slide renders KaTeX-formatted math', async ({ page }) => {
    await page.goto(`${BASE}/01-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
    await expect(page.locator('.katex-display').first()).toBeVisible();
  });
});

test.describe('Metric topology · Closed sets — MCQ flow (closed but not open)', () => {
  const SLIDE = `${BASE}/03-examples-and-non-examples`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#top-closed-mcq-closed-but-not-open`;

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

test.describe('Metric topology · Closed sets — ProofReveal flow (closure is closed)', () => {
  const SLIDE = `${BASE}/02-limit-points-and-closure`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#top-closed-proof-closure-is-closed`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // Before reveal, content from the solution body should not be visible.
    await expect(article.getByText(/triangle inequality/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/triangle inequality/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/triangle inequality/i)).toBeVisible();
  });
});

test.describe('Metric topology · Closed sets — ProofReveal flow (great theorem)', () => {
  const SLIDE = `${BASE}/05-complements-and-open-sets`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#top-closed-proof-complement-open`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // The phrase "for contradiction" appears in both directions of the proof
    // but nowhere else on the slide — a good content marker.
    await expect(article.getByText(/for contradiction/i).first()).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/for contradiction/i).first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/for contradiction/i).first()).toBeVisible();
  });
});
