import { test, expect } from '@playwright/test';

const BASE = '/part-12-differential-geometry/04-a-bit-of-manifolds';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('A bit of manifolds — KaTeX renders', () => {
  test('definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-topological-manifolds/02-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('A bit of manifolds — MCQ flow (which is NOT a manifold)', () => {
  const SLIDE = `${BASE}/01-topological-manifolds/03-examples`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#mfd-top-mcq-which-is-manifold`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // The closed disk D² is NOT a manifold — correct answer is "c"
    await page.getByRole('button', { name: /The closed disk D²/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // The torus is a manifold — clicking it is wrong for the "NOT a manifold" question
    await page.getByRole('button', { name: /The torus S¹ × S¹/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('A bit of manifolds — NumericInput flow (dimension of S²)', () => {
  const SLIDE = `${BASE}/03-regular-value-theorem/02-level-sets`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#mfd-rvt-num-sphere-dim`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('2');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('2');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('A bit of manifolds — ProofReveal flow (smooth function definition)', () => {
  const SLIDE = `${BASE}/02-smooth-manifolds/03-smooth-maps`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#mfd-sm-proof-smooth-fn-example`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/exactly the usual definition/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/exactly the usual definition/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/exactly the usual definition/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('A bit of manifolds — Problem flow (0-form = smooth function)', () => {
  const SLIDE = `${BASE}/08-problems/01-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#mfd-prob-zero-form-is-smooth-fn`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "natural bijection" only appears inside the solution text
    await expect(article.getByText(/natural bijection/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/natural bijection/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
