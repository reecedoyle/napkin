import { test, expect } from '@playwright/test';

const BASE = '/part-12-differential-geometry/01-multivariable-calculus-done-correctly';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Multivariable calculus — KaTeX renders', () => {
  test('definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-the-total-derivative/02-setup-and-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Multivariable calculus — MCQ flow (why linear in 1D)', () => {
  const SLIDE = `${BASE}/01-the-total-derivative/01-derivative-as-linear-map`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#mvc-s1-mcq-why-linear`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /every linear map ℝ → ℝ is determined by a single scalar/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /the derivative is always zero in higher dimensions/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Multivariable calculus — NumericInput flow (partial derivative)', () => {
  const SLIDE = `${BASE}/03-total-and-partial-derivatives/04-computing-total-derivative`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#mvc-s3-num-partial-xy`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('2');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('4');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('4');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Multivariable calculus — ProofReveal flow (projection principle)', () => {
  const SLIDE = `${BASE}/02-the-projection-principle/02-projection-theorem`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#mvc-s2-proof-projection`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/all norms on finite-dimensional spaces are equivalent/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/all norms on finite-dimensional spaces are equivalent/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/all norms on finite-dimensional spaces are equivalent/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Multivariable calculus — Problem flow (chain rule)', () => {
  const SLIDE = `${BASE}/06-problems/01-chain-rule-and-higher-symmetry`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#mvc-prob-chain-rule`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // This phrase only appears inside the chain rule solution, not the prompt
    await expect(article.getByText(/linearity of/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/linearity of/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
