import { test, expect } from '@playwright/test';

const BASE = '/part-18-algebraic-topology-ii-homology/01-singular-homology';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Singular homology — KaTeX renders', () => {
  test('standard simplex slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-simplices-and-boundaries/01-standard-simplex`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Singular homology — MCQ flow (singular 2-simplex)', () => {
  const SLIDE = `${BASE}/01-simplices-and-boundaries/02-examples-of-simplices`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#sh70-simp-mcq-two-simplex`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: 'A continuous image of a triangle in X', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: 'A path in X', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Singular homology — NumericInput flow (H0 rank from path components)', () => {
  const SLIDE = `${BASE}/02-the-singular-homology-groups/05-the-zeroth-homology-group`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#sh70-hom-num-h0-rank`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('3');
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
test.describe('Singular homology — ProofReveal flow (chain homotopy gives a boundary)', () => {
  const SLIDE = `${BASE}/03-the-homology-functor-and-chain-complexes/04-chain-homotopic-maps-agree-on-homology`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#sh70-func-proof-chain-homotopy-zero`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/literally the boundary of/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/literally the boundary of/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/literally the boundary of/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Singular homology — Problem flow (no retraction onto the boundary)', () => {
  const SLIDE = `${BASE}/05-problems/01-no-retraction-onto-the-boundary`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#sh70-prob-no-retraction`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "zero map on ℤ is not the identity" only appears inside the solution text
    await expect(article.getByText(/zero map on ℤ is not the identity/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/zero map on ℤ is not the identity/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
