import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/02-metric-topology/03-continuous-maps';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Metric topology · Continuous maps — KaTeX renders', () => {
  test('definition slide renders KaTeX-formatted math', async ({ page }) => {
    await page.goto(`${BASE}/02-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
    await expect(page.locator('.katex-display').first()).toBeVisible();
  });
});

test.describe('Metric topology · Continuous maps — MCQ flow (which metric)', () => {
  const SLIDE = `${BASE}/02-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#top-cont-mcq-which-metric`;

  test('correct answer is recorded and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /d_M, the metric on the source space M/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:')).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /d_N, the metric on the target space N/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

test.describe('Metric topology · Continuous maps — ProofReveal flow (discrete domain)', () => {
  const SLIDE = `${BASE}/05-from-a-discrete-space`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#top-cont-proof-discrete-domain`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/eventually-constant ones/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/eventually-constant ones/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/eventually-constant ones/i)).toBeVisible();
  });
});
