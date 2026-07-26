import { test, expect } from '@playwright/test';

const BASE = '/part-17-category-theory/01-objects-and-morphisms';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Objects and morphisms — KaTeX renders', () => {
  test('category definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-categories-and-examples/01-what-is-a-category`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Objects and morphisms — MCQ flow (poset composition)', () => {
  const SLIDE = `${BASE}/02-categories-and-examples/07-posets-as-categories`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#oam-cat-mcq-poset-composition`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page
      .getByRole('button', { name: 'The unique arrow p → r, since p ≤ r by transitivity', exact: true })
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
      .getByRole('button', { name: "Undefined — posets don't have composition", exact: true })
      .click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Objects and morphisms — NumericInput flow (poset arrow count)', () => {
  const SLIDE = `${BASE}/02-categories-and-examples/08-posets-example`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#oam-cat-num-poset-arrow-count`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('3');
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
test.describe('Objects and morphisms — ProofReveal flow (initial objects unique)', () => {
  const SLIDE = `${BASE}/03-special-objects/02-initial-objects-unique`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#oam-spec-proof-initial-unique`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/mutually inverse, giving an isomorphism/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/mutually inverse, giving an isomorphism/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/mutually inverse, giving an isomorphism/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Objects and morphisms — Problem flow (Vect_k initial/terminal)', () => {
  const SLIDE = `${BASE}/06-problems/01-vect-k-initial-terminal`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#oam-prob-problem-vect-initial-terminal`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "zero object" (the concept name) appears only in the solution, not the prompt/hint.
    await expect(article.getByText(/an example of what's called a zero object/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/an example of what's called a zero object/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
