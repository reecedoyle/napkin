import { test, expect } from '@playwright/test';

const BASE = '/part-6-representation-theory/01-representations-of-algebras';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Algebras
  { url: `${BASE}/01-algebras/01-motivation`, heading: /why algebras.*motivation/i },
  { url: `${BASE}/01-algebras/02-definition`, heading: /k-algebras.*definition/i },
  { url: `${BASE}/01-algebras/03-examples`, heading: /examples of k-algebras/i },
  { url: `${BASE}/01-algebras/04-group-algebra`, heading: /the group algebra/i },
  { url: `${BASE}/01-algebras/05-homomorphisms-and-direct-sum`, heading: /algebra homomorphisms and direct sums/i },
  // Section 2 — Representations
  { url: `${BASE}/02-representations/01-definition`, heading: /representations.*definition/i },
  { url: `${BASE}/02-representations/02-matrix-algebra-reps`, heading: /representations of matrix algebras/i },
  { url: `${BASE}/02-representations/03-polynomial-algebra-reps`, heading: /representations of polynomial algebras/i },
  { url: `${BASE}/02-representations/04-group-reps`, heading: /group representations via the group algebra/i },
  // Section 3 — Direct sums
  { url: `${BASE}/03-direct-sums/01-definition`, heading: /direct sum of representations/i },
  { url: `${BASE}/03-direct-sums/02-s3-example`, heading: /s.*3.*permutation representation decomposes/i },
  { url: `${BASE}/03-direct-sums/03-reps-of-direct-sum-algebra`, heading: /representations of a.*b decompose/i },
  // Section 4 — Irreducible and indecomposable
  { url: `${BASE}/04-irreducible-and-indecomposable/01-subrepresentations`, heading: /subrepresentations/i },
  { url: `${BASE}/04-irreducible-and-indecomposable/02-irreducible-indecomposable`, heading: /irreducible and indecomposable representations/i },
  { url: `${BASE}/04-irreducible-and-indecomposable/03-indecomposable-not-irreducible`, heading: /indecomposable but not irreducible/i },
  // Section 5 — Morphisms
  { url: `${BASE}/05-morphisms/01-definition`, heading: /intertwining operators.*definition/i },
  { url: `${BASE}/05-morphisms/02-examples`, heading: /examples of intertwining operators/i },
  { url: `${BASE}/05-morphisms/03-kernel-image`, heading: /kernel and image are subrepresentations/i },
  { url: `${BASE}/05-morphisms/04-schur`, heading: /schur.*lemma/i },
  // Section 6 — Representations of Mat_d(k)
  { url: `${BASE}/06-representations-of-matdk/01-theorem-statement`, heading: /representations of mat.*d.*k.*the theorem/i },
  { url: `${BASE}/06-representations-of-matdk/02-proof-sketch`, heading: /proof sketch.*splitting v via matrix idempotents/i },
  // Section 7 — Problems
  { url: `${BASE}/07-problems/01-standard`, heading: /problems.*standard/i },
  { url: `${BASE}/07-problems/02-starred`, heading: /problems.*starred/i },
  { url: `${BASE}/07-problems/03-challenge`, heading: /problems.*challenge/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Representations of algebras — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
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
