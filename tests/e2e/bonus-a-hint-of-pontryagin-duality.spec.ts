import { test, expect } from '@playwright/test';

const BASE = '/part-10-measure-theory/05-bonus-a-hint-of-pontryagin-duality';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Pontryagin duality — KaTeX renders', () => {
  test('Haar measure slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-lca-groups/03-haar-measure`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Pontryagin duality — MCQ flow (which is not locally compact)', () => {
  const SLIDE = `${BASE}/01-lca-groups/02-locally-compact-abelian`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#pont-lca-mcq-which-lca`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // ℚ with subspace topology is NOT locally compact — correct answer is "d"
    await page.getByRole('button', { name: 'ℚ with the subspace topology from ℝ', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // ℝ is locally compact — clicking it is wrong for the "NOT locally compact" question
    await page.getByRole('button', { name: 'ℝ with the standard topology', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Pontryagin duality — NumericInput flow (characters of ℤ/6ℤ)', () => {
  const SLIDE = `${BASE}/03-orthonormal-basis-compact-case/03-special-cases`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#pont-compact-num-chars-z6`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('6');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('6');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Pontryagin duality — ProofReveal flow (compact implies G-hat discrete)', () => {
  const SLIDE = `${BASE}/02-the-pontryagin-dual/03-compact-discrete-duality`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#pont-dual-proof-compact-discrete`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/trivial character is an isolated point/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/trivial character is an isolated point/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/trivial character is an isolated point/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Pontryagin duality — Problem flow (dual measure is counting measure)', () => {
  const SLIDE = `${BASE}/07-problems/01-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#pont-prob-dual-measure-compact`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "counting measure" only appears inside the solution text
    await expect(article.getByText(/counting measure/i).first()).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/counting measure/i).first()).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
