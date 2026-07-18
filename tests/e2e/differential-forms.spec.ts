import { test, expect } from '@playwright/test';

const BASE = '/part-12-differential-geometry/02-differential-forms';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Differential forms — KaTeX renders', () => {
  test('formal definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-differential-forms/01-formal-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Differential forms — MCQ flow (which is a 0-form)', () => {
  const SLIDE = `${BASE}/01-pictures-of-differential-forms/02-zero-forms`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#df-s1-mcq-zero-form`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /smooth function f\(x, y\) = x² \+ y²/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /arc-length element ds/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Differential forms — NumericInput flow (evaluation of 2-form)', () => {
  const SLIDE = `${BASE}/03-differential-forms/03-evaluating-a-form`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#df-s3-num-eval-form`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('7');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('21');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('21');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Differential forms — ProofReveal flow (integral of df)', () => {
  const SLIDE = `${BASE}/02-pictures-of-exterior-derivatives/01-df-from-a-function`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#df-s2-proof-stokes-0form`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/all the intermediate changes cancel/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/all the intermediate changes cancel/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/all the intermediate changes cancel/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Differential forms — Problem flow (angle form closed)', () => {
  const SLIDE = `${BASE}/08-problems/01-angle-form-and-dd-zero`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#df-prob-angle-form-closed`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "∂g/∂x = ∂f/∂y" appears only inside the solution text
    await expect(article.getByText(/The angle form is closed/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/The angle form is closed/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
