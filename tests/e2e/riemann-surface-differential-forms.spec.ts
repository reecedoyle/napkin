import { test, expect } from '@playwright/test';

const BASE = '/part-13-riemann-surfaces/04-differential-forms';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Riemann-surface differential forms — KaTeX renders', () => {
  test('dz slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-differential-form-on-cc/03-the-form-dz`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Riemann-surface differential forms — MCQ flow (projection principle)', () => {
  const SLIDE = `${BASE}/01-differential-form-on-cc/02-complex-vs-real-coefficients`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#rs50-s1-mcq-coefficients`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /Two real-valued 1-forms/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /A single real-valued 1-form/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Riemann-surface differential forms — NumericInput flow (dz on i)', () => {
  const SLIDE = `${BASE}/01-differential-form-on-cc/03-the-form-dz`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#rs50-s1-num-dz-on-i`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a complex number').first();
    await input.fill('0');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('i');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('i');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Riemann-surface differential forms — ProofReveal flow (holomorphic check)', () => {
  const SLIDE = `${BASE}/02-visualization-of-differential-forms/06-holomorphic-forms-definition`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#rs50-s2-proof-holomorphic-check`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Cauchy.Riemann equations confirm/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Cauchy.Riemann equations confirm/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Cauchy.Riemann equations confirm/i)).toBeVisible();
  });
});
