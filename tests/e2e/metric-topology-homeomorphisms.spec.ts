import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/02-metric-topology/04-homeomorphisms';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Metric topology · Homeomorphisms — KaTeX renders', () => {
  test('size-not-preserved slide renders KaTeX-formatted math', async ({ page }) => {
    await page.goto(`${BASE}/05-size-not-preserved`);
    await expect(page.locator('.katex').first()).toBeVisible();
    await expect(page.locator('.katex-display').first()).toBeVisible();
  });
});

test.describe('Metric topology · Homeomorphisms — figure renders', () => {
  test('continuous-deformation slide renders an SVG figure', async ({ page }) => {
    await page.goto(`${BASE}/03-continuous-deformation`);
    const fig = page.getByRole('figure', {
      name: /unit circle inscribed inside a larger square/i,
    });
    await expect(fig).toBeVisible();
    await expect(fig.locator('svg')).toBeVisible();
    // The dashed bijection ray should be present
    await expect(fig.locator('svg line[stroke-dasharray]')).toHaveCount(1);
  });
});

test.describe('Metric topology · Homeomorphisms — MCQ flow (not a homeomorphism)', () => {
  const SLIDE = `${BASE}/02-why-inverse-continuous`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#top-homeo-mcq-not-a-homeomorphism`;

  test('correct answer is recorded and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /continuous bijection \[0, 1\) -> S\^1/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:')).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /identity map M -> M on any metric space/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

test.describe('Metric topology · Homeomorphisms — ProofReveal flow (tan bijection)', () => {
  const SLIDE = `${BASE}/05-size-not-preserved`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#top-homeo-proof-tan-bijection`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/strictly increasing/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/strictly increasing/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/strictly increasing/i)).toBeVisible();
  });
});
