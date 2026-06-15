import { test, expect } from '@playwright/test';

const BASE = '/part-8-calculus/05-riemann-integrals';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Riemann integrals — KaTeX renders', () => {
  test('uniform continuity slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-uniform-continuity/01-what-is-uniform-continuity`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Riemann integrals — MCQ flow (which function is not uniformly continuous)', () => {
  const SLIDE = `${BASE}/01-uniform-continuity/01-what-is-uniform-continuity`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#ri-uc-mcq-which-uniform`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // f(x) = x² is NOT uniformly continuous on ℝ — correct answer is "c"
    await page.getByRole('button', { name: /f\(x\) = x²/ }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // f(x) = sin x IS uniformly continuous — clicking it is wrong
    await page.getByRole('button', { name: /f\(x\) = sin x/ }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Riemann integrals — NumericInput flow (sup-norm distance)', () => {
  const SLIDE = `${BASE}/03-defining-the-riemann-integral/01-rectangle-functions`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#ri-def-num-supnorm`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('1');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('3');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Riemann integrals — ProofReveal flow (extension theorem proof)', () => {
  const SLIDE = `${BASE}/02-dense-sets-and-extension/03-extension-theorem`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#ri-dense-proof-cauchy`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/uniform continuity of ψ to find δ/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/uniform continuity of ψ to find δ/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/uniform continuity of ψ to find δ/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Riemann integrals — Problem flow (harmonic sum → log 2)', () => {
  const SLIDE = `${BASE}/05-problems/01-standard-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#ri-prob-harmonic-log2`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "right-endpoint Riemann sum" only appears inside the solution text
    await expect(article.getByText(/right-endpoint Riemann sum/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).nth(1).click();
    await expect(article.getByText(/right-endpoint Riemann sum/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
