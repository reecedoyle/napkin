import { test, expect } from '@playwright/test';

const BASE = '/part-8-calculus/02-p-adic-numbers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('p-adic numbers — KaTeX renders', () => {
  test('analytic-perspective metric slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-analytic-perspective/01-p-adic-metric`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('p-adic numbers — MCQ flow (why ℤ/p²ℤ is not a field)', () => {
  const SLIDE = `${BASE}/01-motivation/02-wish-list`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#pad-mot-mcq-z-p2-field`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /p · p = p² = 0, so p is a zero-divisor/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /It has characteristic 0/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('p-adic numbers — NumericInput flow (50 mod 9 in ℤ₃)', () => {
  const SLIDE = `${BASE}/02-algebraic-perspective/02-zp-examples`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#pad-alg-num-z3-50-mod9`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('8');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('5');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('5');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('p-adic numbers — ProofReveal flow (units in ℤₚ)', () => {
  const SLIDE = `${BASE}/02-algebraic-perspective/04-units-in-zp`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#pad-alg-proof-zp-units`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/the component xₑ is not divisible/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/the component xₑ is not divisible/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/the component xₑ is not divisible/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('p-adic numbers — Problem flow (simultaneous convergence)', () => {
  const SLIDE = `${BASE}/05-problems/02-simultaneous-convergence`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#pad-prob-simultaneous-conv`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // solution text contains "the denominator is a p-adic unit" — hidden before reveal
    await expect(article.getByText(/the denominator is a p-adic unit/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/the denominator is a p-adic unit/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
