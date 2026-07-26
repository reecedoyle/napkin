import { test, expect } from '@playwright/test';

const BASE = '/part-18-algebraic-topology-ii-homology/06-application-of-cohomology';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Application of cohomology — KaTeX renders', () => {
  test('Poincaré duality theorem slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-poincare-duality/02-the-duality-theorem`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Application of cohomology — MCQ flow (is ℤ[x] anticommutative)', () => {
  const SLIDE = `${BASE}/03-graded-rings/03-graded-ring-and-anticommutative`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#aoc75-gr-mcq-zx-anticommutative`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page
      .getByRole('button', { name: 'No — anticommutativity would force x² = −x², i.e. 2x² = 0, which fails in ℤ[x]', exact: true })
      .click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page
      .getByRole('button', { name: 'Yes — every commutative graded ring is automatically anticommutative', exact: true })
      .click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Application of cohomology — NumericInput flow (Betti symmetry)', () => {
  const SLIDE = `${BASE}/01-poincare-duality/03-symmetric-betti-numbers`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#aoc75-pd-num-betti-symmetry`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('4');
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
test.describe('Application of cohomology — ProofReveal flow (Ext(H,ℝ) = 0)', () => {
  const SLIDE = `${BASE}/02-de-rham-cohomology/01-real-coefficients`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#aoc75-drc-proof-ext-vanishes`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/ℝ is divisible/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/ℝ is divisible/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/ℝ is divisible/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Application of cohomology — Problem flow (Betti symmetry proof)', () => {
  const SLIDE = `${BASE}/09-problems/01-betti-symmetry`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#aoc75-prob-betti-symmetry-proof`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "contributes rank 1 per ℤ-summand" only appears inside the solution text
    await expect(article.getByText(/contributes rank 1 per ℤ-summand/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/contributes rank 1 per ℤ-summand/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
