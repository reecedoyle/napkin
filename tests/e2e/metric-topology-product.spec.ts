import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/02-metric-topology/05-product-metric';

const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  { url: `${BASE}/01-three-candidates`, heading: /Three candidates for a product metric/i },
  { url: `${BASE}/02-all-three-equivalent`, heading: /All three are equivalent/i },
  { url: `${BASE}/03-the-product-metric`, heading: /The product metric/i },
  { url: `${BASE}/04-componentwise-convergence`, heading: /Convergence is componentwise/i },
  { url: `${BASE}/05-arithmetic-is-continuous`, heading: /Addition and multiplication are continuous/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Metric topology · Product metric — slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

test.describe('Metric topology · Product metric — KaTeX renders', () => {
  test('three-candidates slide renders KaTeX-formatted math', async ({ page }) => {
    await page.goto(`${BASE}/01-three-candidates`);
    await expect(page.locator('.katex').first()).toBeVisible();
    await expect(page.locator('.katex-display').first()).toBeVisible();
  });
});

test.describe('Metric topology · Product metric — NumericInput flow (d_max)', () => {
  const SLIDE = `${BASE}/01-three-candidates`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#top-prod-num-dmax`;

  test('correct answer is recorded and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByPlaceholder('a number').fill('4');
    await page.getByRole('button', { name: /check/i }).click();

    await expect(page.getByText(/^Correct\.$/)).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText(/^Correct\.$/)).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByPlaceholder('a number').fill('5');
    await page.getByRole('button', { name: /check/i }).click();

    await expect(page.getByText(/Not quite/i)).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

test.describe('Metric topology · Product metric — MCQ flow (componentwise convergence)', () => {
  const SLIDE = `${BASE}/04-componentwise-convergence`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#top-prod-mcq-componentwise-convergence`;

  test('correct answer is recorded and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /x_n -> x in M, and y_n -> y in N \(both\)/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:')).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /x_n -> x in M, or y_n -> y in N \(at least one\)/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

test.describe('Metric topology · Product metric — ProofReveal flow (chain of inequalities)', () => {
  const SLIDE = `${BASE}/02-all-three-equivalent`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#top-prod-proof-chain-of-inequalities`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/squaring is fine/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/squaring is fine/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/squaring is fine/i)).toBeVisible();
  });
});
