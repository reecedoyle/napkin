import { test, expect } from '@playwright/test';

const BASE = '/part-15-algebraic-nt-ii-galois-and-ramification-theory/01-things-galois';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Things Galois — KaTeX renders', () => {
  test('tower law slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-field-extensions/02-tower-law`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Things Galois — MCQ flow (embeddings of ℚ(∛2))', () => {
  const SLIDE = `${BASE}/01-motivation/03-example-qcbrt2`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#gal-mot-mcq-cbrt2-count`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page
      .getByRole('button', { name: '3 — one per root of the minimal polynomial x³−2', exact: true })
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
      .getByRole('button', { name: '1 — only the identity is a field homomorphism', exact: true })
      .click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Things Galois — NumericInput flow (degree of ℚ(∛2, ω))', () => {
  const SLIDE = `${BASE}/05-automorphism-groups/07-cautionary-tale-cbrt2`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#gal-aut-num-degree-splitting-cbrt2`;

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
test.describe('Things Galois — ProofReveal flow (embeddings fix ℚ)', () => {
  const SLIDE = `${BASE}/01-motivation/01-embeddings`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#gal-mot-proof-fix-q`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/embeddings never move rational numbers/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/embeddings never move rational numbers/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/embeddings never move rational numbers/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Things Galois — Problem flow (degree-three Galois extension)', () => {
  const SLIDE = `${BASE}/07-problems/02-degree-three-galois-extension`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#gal-prob-degree-three-galois`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "maximal real subfield" only appears inside the solution, not the prompt.
    await expect(article.getByText(/maximal real subfield/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/maximal real subfield/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
