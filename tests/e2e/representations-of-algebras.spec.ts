import { test, expect } from '@playwright/test';

const BASE = '/part-6-representation-theory/01-representations-of-algebras';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Representations of algebras — KaTeX renders', () => {
  test('definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-representations/01-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Representations of algebras — MCQ flow (Schur counterexample)', () => {
  const SLIDE = `${BASE}/05-morphisms/04-schur`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#ralg-mor-mcq-schur`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /ℝ is not algebraically closed/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /rotation by 90° is not linear/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Representations of algebras — ProofReveal flow (decomposing A⊕B reps)', () => {
  const SLIDE = `${BASE}/03-direct-sums/03-reps-of-direct-sum-algebra`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#ralg-ds-proof-decomp`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/disjoint/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/disjoint/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/disjoint/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Representations of algebras — Problem flow (1-dim reps)', () => {
  const SLIDE = `${BASE}/07-problems/01-standard`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#ralg-prob-one-dim-isom`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "nonzero scalar" only appears inside the solution text
    await expect(article.getByText(/nonzero scalar/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/nonzero scalar/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
