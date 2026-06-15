import { test, expect } from '@playwright/test';

const BASE = '/part-8-calculus/04-power-and-taylor-series';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Power and Taylor series — KaTeX renders', () => {
  test('Cauchy–Hadamard slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-power-series/02-cauchy-hadamard`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Power and Taylor series — MCQ flow (analytic check)', () => {
  const SLIDE = `${BASE}/04-analytic-functions/03-analytic-on-interval`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#pts-anal-mcq-analytic-check`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // The piecewise e^{-1/x} function is NOT analytic on all of ℝ — correct answer is "d"
    await page.getByRole('button', { name: /The function f\(x\) = e\^\{-1\/x\}/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // sin(x) IS analytic — clicking it is wrong for the "NOT analytic" question
    await page.getByRole('button', { name: /sin\(x\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Power and Taylor series — NumericInput flow (radius of convergence)', () => {
  const SLIDE = `${BASE}/02-power-series/03-power-series-as-functions`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#pts-ps-num-r-geometric`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('2');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('1/2');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('1/2');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Power and Taylor series — ProofReveal flow (coefficients from derivatives)', () => {
  const SLIDE = `${BASE}/03-differentiating-them/02-coefficients-from-derivatives`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#pts-diff-proof-coeff`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/only the k = n term survives/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/only the k = n term survives/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/only the k = n term survives/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Power and Taylor series — Problem flow (log Taylor series)', () => {
  const SLIDE = `${BASE}/07-problems/01-standard-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#pts-prob-log-taylor`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "Integrating term by term" only appears inside the solution text, not the prompt
    await expect(article.getByText(/Integrating term by term/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/Integrating term by term/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
