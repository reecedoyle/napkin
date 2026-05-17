import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/02-metric-topology/02-convergence';

const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  { url: `${BASE}/01-definition-of-convergence`, heading: /Convergence in a metric space/i },
  { url: `${BASE}/02-picture-of-convergence`, heading: /picture of convergence/i },
  { url: `${BASE}/03-rationals-vs-reals`, heading: /Convergence depends on the parent space/i },
  { url: `${BASE}/04-discrete-convergence`, heading: /Convergence in a discrete space/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Metric topology · Convergence section — slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

test.describe('Metric topology · Convergence section — KaTeX renders', () => {
  test('definition slide renders KaTeX-formatted math', async ({ page }) => {
    await page.goto(`${BASE}/01-definition-of-convergence`);
    await expect(page.locator('.katex').first()).toBeVisible();
    await expect(page.locator('.katex-display').first()).toBeVisible();
  });
});

test.describe('Metric topology · Convergence section — figure renders', () => {
  test('picture-of-convergence slide renders an SVG figure', async ({ page }) => {
    await page.goto(`${BASE}/02-picture-of-convergence`);
    const fig = page.getByRole('figure', {
      name: /Nine labelled points x1 through x9/i,
    });
    await expect(fig).toBeVisible();
    await expect(fig.locator('svg')).toBeVisible();
    // The dashed r-neighborhood circle should be present
    await expect(fig.locator('svg circle[stroke-dasharray]')).toHaveCount(1);
  });
});

test.describe('Metric topology · Convergence — MCQ flow (rationals question)', () => {
  const SLIDE = `${BASE}/03-rationals-vs-reals`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#top-conv-mcq-rationals`;

  test('correct answer is recorded and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /sqrt\(2\) is not in Q/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:')).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /the sequence is unbounded/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

test.describe('Metric topology · Convergence — ProofReveal flow (discrete sequences)', () => {
  const SLIDE = `${BASE}/04-discrete-convergence`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#top-conv-proof-discrete`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/eventually constant/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/eventually constant/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/eventually constant/i)).toBeVisible();
  });
});
