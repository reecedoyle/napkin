import { test, expect } from '@playwright/test';

const BASE = '/part-8-calculus/01-limits-and-series';

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Limits and series — KaTeX renders', () => {
  test('sup/inf slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-completeness-and-inf-sup/03-sup-and-inf`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Limits and series — MCQ flow (Cauchy in ℚ)', () => {
  const SLIDE = `${BASE}/01-completeness-and-inf-sup/01-completeness-of-R`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#lim-s1-mcq-complete`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.goto(SLIDE);
    // Truncations of √2 — correct answer is "b"
    await page.getByRole('button', { name: /truncations of √2/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.goto(SLIDE);
    // Constant sequence — wrong answer
    await page.getByRole('button', { name: /constant sequence/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Limits and series — NumericInput flow (sup of 1−1/n)', () => {
  const SLIDE = `${BASE}/01-completeness-and-inf-sup/04-sup-of-sequences`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#lim-s1-num-sup-seq`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
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

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Limits and series — ProofReveal flow (epsilon-delta linear)', () => {
  const SLIDE = `${BASE}/06-limits-at-points/04-limits-check`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#lim-s6-proof-linear`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "the choice δ = ε/3 witnesses the limit" is inside the hidden solution text
    await expect(article.getByText(/the choice/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/the choice/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/the choice/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Limits and series — Problem flow (comparison test)', () => {
  const SLIDE = `${BASE}/08-problems/02-series-tests`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#lim-prob-comparison-test`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "We need to show" only appears inside the comparison test solution text, not the prompt
    await expect(article.getByText(/We need to show/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/We need to show/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
