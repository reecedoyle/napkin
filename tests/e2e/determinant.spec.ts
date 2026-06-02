import { test, expect } from '@playwright/test';

const BASE = '/part-4-linear-algebra/04-determinant';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Wedge product
  { url: `${BASE}/01-wedge-product/01-motivation`, heading: /why wedge products/i },
  { url: `${BASE}/01-wedge-product/02-definition`, heading: /2-wedge product.*definition/i },
  { url: `${BASE}/01-wedge-product/03-explicit-computation`, heading: /explicit computation/i },
  { url: `${BASE}/01-wedge-product/04-basis-of-wedge2`, heading: /basis of the 2-wedge product/i },
  { url: `${BASE}/01-wedge-product/05-higher-wedge`, heading: /higher wedge product/i },
  // Section 2 — The determinant
  { url: `${BASE}/02-the-determinant/01-induced-map`, heading: /induced wedge map/i },
  { url: `${BASE}/02-the-determinant/02-top-wedge-is-1d`, heading: /top wedge is one-dimensional/i },
  { url: `${BASE}/02-the-determinant/03-two-by-two-example`, heading: /determinant of a 2×2 matrix/i },
  { url: `${BASE}/02-the-determinant/04-multiplicativity`, heading: /determinant is multiplicative/i },
  { url: `${BASE}/02-the-determinant/05-leibniz-formula`, heading: /leibniz formula/i },
  // Section 3 — Characteristic polynomials
  { url: `${BASE}/03-characteristic-polynomials/01-definition`, heading: /characteristic polynomial.*definition/i },
  { url: `${BASE}/03-characteristic-polynomials/02-cayley-hamilton`, heading: /cayley.*hamilton theorem/i },
  { url: `${BASE}/03-characteristic-polynomials/03-proof`, heading: /cayley.*hamilton.*proof/i },
  { url: `${BASE}/03-characteristic-polynomials/04-ch-example`, heading: /cayley.*hamilton.*worked example/i },
  { url: `${BASE}/03-characteristic-polynomials/05-complexification`, heading: /cayley.*hamilton over non-algebraically/i },
  // Section 4 — Problems
  { url: `${BASE}/04-problems/01-standard`, heading: /problems.*standard/i },
  { url: `${BASE}/04-problems/02-starred`, heading: /problems.*starred/i },
  { url: `${BASE}/04-problems/03-daggered`, heading: /problems.*daggered/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Determinant — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Determinant — KaTeX renders', () => {
  test('determinant definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-the-determinant/02-top-wedge-is-1d`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Determinant — MCQ flow (2×2 determinant value)', () => {
  const SLIDE = `${BASE}/02-the-determinant/03-two-by-two-example`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#det-det-mcq-2x2-value`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Correct answer is "a" = 10
    await page.getByRole('button', { name: /^10$/ }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // "b" = 14 is wrong
    await page.getByRole('button', { name: /^14$/ }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Determinant — NumericInput flow (dim of ∧²(ℝ⁴))', () => {
  const SLIDE = `${BASE}/01-wedge-product/04-basis-of-wedge2`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#det-wedge-num-dim-wedge2-r4`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('4');
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
test.describe('Determinant — ProofReveal flow (anti-symmetry from v∧v=0)', () => {
  const SLIDE = `${BASE}/01-wedge-product/02-definition`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#det-wedge-proof-antisymmetry`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Expand/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Expand/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Expand/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Determinant — Problem flow (column operations)', () => {
  const SLIDE = `${BASE}/04-problems/01-standard`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#det-prob-column-operations`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "bilinearity" only appears inside the solution text
    await expect(article.getByText(/bilinearity/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/bilinearity/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
