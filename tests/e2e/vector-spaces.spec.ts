import { test, expect } from '@playwright/test';

const BASE = '/part-4-linear-algebra/01-vector-spaces';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Rings and fields
  { url: `${BASE}/01-rings-and-fields/01-rings-and-fields-review`, heading: /rings and fields.*quick review/i },
  // Section 2 — Modules and vector spaces
  { url: `${BASE}/02-modules-and-vector-spaces/01-what-is-a-module`, heading: /what is a module/i },
  { url: `${BASE}/02-modules-and-vector-spaces/02-first-examples`, heading: /first examples of vector spaces/i },
  { url: `${BASE}/02-modules-and-vector-spaces/03-modules-over-ZZ`, heading: /abelian groups as.*modules/i },
  // Section 3 — Direct sums
  { url: `${BASE}/03-direct-sums/01-splitting-a-space`, heading: /splitting a space/i },
  { url: `${BASE}/03-direct-sums/02-external-direct-sum`, heading: /external direct sum/i },
  // Section 4 — Linear independence and bases
  { url: `${BASE}/04-linear-independence-and-bases/01-linear-combinations`, heading: /linear combinations/i },
  { url: `${BASE}/04-linear-independence-and-bases/02-basis-examples`, heading: /basis examples/i },
  { url: `${BASE}/04-linear-independence-and-bases/03-dimension-theorem`, heading: /dimension theorem/i },
  { url: `${BASE}/04-linear-independence-and-bases/04-coordinates`, heading: /coordinates and dimension/i },
  // Section 5 — Linear maps
  { url: `${BASE}/05-linear-maps/01-definition`, heading: /linear maps.*definition/i },
  { url: `${BASE}/05-linear-maps/02-examples`, heading: /linear map examples/i },
  // Section 6 — Matrices
  { url: `${BASE}/06-matrices/01-encoding-a-map`, heading: /encoding a linear map/i },
  { url: `${BASE}/06-matrices/02-matrix-multiplication`, heading: /where matrix multiplication comes from/i },
  { url: `${BASE}/06-matrices/03-general-matrix`, heading: /matrices in general/i },
  // Section 7 — Subspaces
  { url: `${BASE}/07-subspaces/01-subspaces-and-kernels`, heading: /subspaces.*kernels.*spans/i },
  { url: `${BASE}/07-subspaces/02-basis-completion`, heading: /basis completion/i },
  { url: `${BASE}/07-subspaces/03-rank-nullity`, heading: /rank-nullity/i },
  // Section 8 — Lagrange interpolation
  { url: `${BASE}/08-lagrange-interpolation/01-the-theorem`, heading: /lagrange interpolation/i },
  { url: `${BASE}/08-lagrange-interpolation/02-injective-implies-bijective`, heading: /injective.*surjective.*bijective/i },
  // Section 9 — General modules
  { url: `${BASE}/09-general-modules/01-free-modules`, heading: /general modules.*free and finitely generated/i },
  { url: `${BASE}/09-general-modules/02-abelian-groups-as-modules`, heading: /abelian groups as.*modules/i },
  // Section 10 — Problems
  { url: `${BASE}/10-problems/01-standard-and-daggered`, heading: /problems.*standard and daggered/i },
  { url: `${BASE}/10-problems/02-starred-and-more`, heading: /problems.*starred and more/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Vector spaces — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Vector spaces — KaTeX renders', () => {
  test('dimension theorem slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/04-linear-independence-and-bases/03-dimension-theorem`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Vector spaces — MCQ flow (which is a field)', () => {
  const SLIDE = `${BASE}/01-rings-and-fields/01-rings-and-fields-review`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#vs-rings-mcq-which-field`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // ℚ is the correct answer (a field)
    await page.getByRole('button', { name: /ℚ \(rationals under \+ and ·\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // ℤ is NOT a field — clicking it is wrong for the "which is a field" question
    await page.getByRole('button', { name: /ℤ \(integers under \+ and ·\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Vector spaces — NumericInput flow (dimension of plane in ℝ³)', () => {
  const SLIDE = `${BASE}/04-linear-independence-and-bases/04-coordinates`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#vs-basis-num-dim-plane`;

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
test.describe('Vector spaces — ProofReveal flow (rank-nullity)', () => {
  const SLIDE = `${BASE}/07-subspaces/03-rank-nullity`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#vs-sub-proof-rank-nullity`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/adapted bases/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/adapted bases/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/adapted bases/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Vector spaces — Problem flow (idempotent decomposition)', () => {
  const SLIDE = `${BASE}/10-problems/02-starred-and-more`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#vs-prob-idempotent`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "ker P ∩ im P" only appears inside the idempotent solution text
    await expect(article.getByText(/ker P ∩ im P/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/ker P ∩ im P/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
