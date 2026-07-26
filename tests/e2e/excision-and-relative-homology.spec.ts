import { test, expect } from '@playwright/test';

const BASE = '/part-18-algebraic-topology-ii-homology/03-excision-and-relative-homology';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Excision and relative homology — KaTeX renders', () => {
  test('excision theorem slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/04-excision/01-excision-theorem`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Excision and relative homology — MCQ flow (H_n(X,X))', () => {
  const SLIDE = `${BASE}/02-long-exact-sequences/05-check-understanding`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#ear72-les-mcq-hn-x-x`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: '0 for every n', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: 'It depends on X', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Excision and relative homology — NumericInput flow (rank of H̃₄(S⁴))', () => {
  const SLIDE = `${BASE}/05-applications/05-check-understanding`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#ear72-applications-num-h4-s4-rank`;

  test('wrong then correct, persists across reload', async ({ page }) => {
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
test.describe('Excision and relative homology — ProofReveal flow (deformation-retract triple exercise)', () => {
  const SLIDE = `${BASE}/03-category-of-pairs/07-exercise-deformation-retract-triple`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#ear72-pairs-proof-replace-a-with-v`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/forces this map to be both injective and surjective/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/forces this map to be both injective and surjective/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/forces this map to be both injective and surjective/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Excision and relative homology — Problem flow (H̃₁(ℝ, ℚ))', () => {
  const SLIDE = `${BASE}/07-problems/02-reals-mod-rationals`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#ear72-prob-reals-mod-rationals`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "countably infinitely many copies" only appears inside the solution text.
    await expect(article.getByText(/countably infinitely many copies/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/countably infinitely many copies/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
