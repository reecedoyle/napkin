import { test, expect } from '@playwright/test';

const BASE = '/part-8-calculus/03-differentiation';

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Differentiation — KaTeX renders', () => {
  test('limit-definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-definition/01-the-limit-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Differentiation — MCQ flow (f′(p) meaning)', () => {
  const SLIDE = `${BASE}/01-definition/05-the-abuse-of-notation`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#diff-def-mcq-notation`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.evaluate(() => window.localStorage.clear());

    // correct answer is "b" — slope of the tangent line
    await page.getByRole('button', { name: /slope of the tangent/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.evaluate(() => window.localStorage.clear());

    // "a" is wrong — it's the function value, not the derivative
    await page.getByRole('button', { name: /value of f at the point p/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Differentiation — NumericInput flow (f′(2) for f(x)=x³)', () => {
  const SLIDE = `${BASE}/01-definition/03-computing-x-cubed`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#diff-def-num-x-cubed-at-2`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.evaluate(() => window.localStorage.clear());

    const input = page.getByPlaceholder('a number').first();
    await input.fill('6');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('12');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('12');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Differentiation — ProofReveal flow (differentiable implies continuous)', () => {
  const SLIDE = `${BASE}/01-definition/04-differentiable-implies-continuous`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#diff-def-proof-diff-implies-cont`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.evaluate(() => window.localStorage.clear());

    const article = page.getByRole('article');
    await expect(article.getByText(/the first factor h/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/the first factor h/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/the first factor h/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Differentiation — Problem flow (derivative of x^x)', () => {
  const SLIDE = `${BASE}/06-problems/04-derivative-of-xx`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#diff-prob-deriv-xx`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);
    await page.evaluate(() => window.localStorage.clear());

    const article = page.getByRole('article');
    // "apply the chain rule (with the fact that" only appears inside the solution
    await expect(article.getByText(/apply the chain rule \(with the fact that/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/apply the chain rule \(with the fact that/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
