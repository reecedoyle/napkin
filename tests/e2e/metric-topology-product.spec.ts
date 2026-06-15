import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/02-metric-topology/05-product-metric';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
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
