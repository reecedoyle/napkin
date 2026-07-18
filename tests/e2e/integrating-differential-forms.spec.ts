import { test, expect } from '@playwright/test';

const BASE = '/part-12-differential-geometry/03-integrating-differential-forms';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Integrating differential forms — KaTeX renders', () => {
  test('cells slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-cells/02-integrating-over-cells`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Integrating differential forms — MCQ flow (tangent vector)', () => {
  const SLIDE = `${BASE}/01-motivation-line-integrals/02-defining-the-line-integral`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#stk-mot-mcq-tangent-vector`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Correct answer is "b" — the tangent vector interpretation
    await page.getByRole('button', { name: /The tangent vector to c at time t/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // "a" is wrong — position, not tangent vector
    await page.getByRole('button', { name: /The position c\(t\) on the curve/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Integrating differential forms — NumericInput flow (area of unit disk)', () => {
  const SLIDE = `${BASE}/03-cells/03-area-of-a-circle`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#stk-cells-num-area-unit-disk`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
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
test.describe('Integrating differential forms — ProofReveal flow (naturality)', () => {
  const SLIDE = `${BASE}/02-pullbacks/03-properties`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#stk-pull-proof-naturality`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/applying the outer pullback definition first/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/applying the outer pullback definition first/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/applying the outer pullback definition first/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe("Integrating differential forms — Problem flow (Green's theorem)", () => {
  const SLIDE = `${BASE}/07-problems/01-green-and-boundary`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#stk-prob-greens-theorem`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "gives exactly Green's theorem" only appears inside the solution text
    await expect(article.getByText(/gives exactly Green's theorem/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/gives exactly Green's theorem/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
