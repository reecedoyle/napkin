import { test, expect } from '@playwright/test';

const BASE = '/part-2-basic-abstract-algebra/01-quotient-groups';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Generators and presentations
  { url: `${BASE}/01-generators-and-presentations/01-generating-a-subgroup`, heading: /generating a subgroup/i },
  { url: `${BASE}/01-generators-and-presentations/02-group-presentations`, heading: /group presentations/i },
  { url: `${BASE}/01-generators-and-presentations/03-free-groups`, heading: /free groups/i },
  { url: `${BASE}/01-generators-and-presentations/04-presentations-can-look-different`, heading: /presentations can look very different/i },
  { url: `${BASE}/01-generators-and-presentations/05-generators-in-finite-groups`, heading: /generators in finite groups/i },
  // Section 2 — Homomorphisms
  { url: `${BASE}/02-homomorphisms/01-what-is-a-homomorphism`, heading: /what is a homomorphism/i },
  { url: `${BASE}/02-homomorphisms/02-examples`, heading: /examples of homomorphisms/i },
  { url: `${BASE}/02-homomorphisms/03-basic-properties`, heading: /basic properties of homomorphisms/i },
  { url: `${BASE}/02-homomorphisms/04-kernel`, heading: /the kernel/i },
  { url: `${BASE}/02-homomorphisms/05-kernels-computed`, heading: /computing kernels/i },
  { url: `${BASE}/02-homomorphisms/06-homomorphism-mcq`, heading: /homomorphism check/i },
  // Section 3 — Cosets and modding out
  { url: `${BASE}/03-cosets-and-modding-out/01-motivation`, heading: /why quotient groups/i },
  { url: `${BASE}/03-cosets-and-modding-out/02-fibers-as-sets`, heading: /fibers of a homomorphism/i },
  { url: `${BASE}/03-cosets-and-modding-out/03-cosets`, heading: /left cosets/i },
  { url: `${BASE}/03-cosets-and-modding-out/04-normal-subgroups`, heading: /normal subgroups/i },
  { url: `${BASE}/03-cosets-and-modding-out/05-quotient-is-isomorphic-to-image`, heading: /the quotient captures the image/i },
  { url: `${BASE}/03-cosets-and-modding-out/06-coset-exercise`, heading: /working with cosets/i },
  { url: `${BASE}/03-cosets-and-modding-out/07-equivalence-relation`, heading: /cosets as equivalence classes/i },
  { url: `${BASE}/03-cosets-and-modding-out/08-cosets-proofreveal`, heading: /proving x.*y.*n/i },
  // Section 4 — Lagrange
  { url: `${BASE}/04-lagrange-proof/01-cosets-partition`, heading: /cosets partition the group/i },
  { url: `${BASE}/04-lagrange-proof/02-lagrange`, heading: /lagrange.*theorem/i },
  { url: `${BASE}/04-lagrange-proof/03-lagrange-consequences`, heading: /consequences of lagrange/i },
  // Section 5 — Eliminating the homomorphism
  { url: `${BASE}/05-eliminating-the-homomorphism/01-well-definedness`, heading: /well-definedness of coset multiplication/i },
  { url: `${BASE}/05-eliminating-the-homomorphism/02-conjugation-condition`, heading: /the conjugation condition/i },
  { url: `${BASE}/05-eliminating-the-homomorphism/03-non-normal-example`, heading: /a non-normal subgroup/i },
  { url: `${BASE}/05-eliminating-the-homomorphism/04-quotient-computation`, heading: /an explicit quotient computation/i },
  { url: `${BASE}/05-eliminating-the-homomorphism/05-quotients-vs-products`, heading: /quotients and products don.*t cancel/i },
  { url: `${BASE}/05-eliminating-the-homomorphism/06-normal-summary`, heading: /summary.*normal subgroups/i },
  // Section 6 — First isomorphism theorem
  { url: `${BASE}/06-first-isomorphism-theorem/01-the-textbook-approach`, heading: /the textbook approach/i },
  { url: `${BASE}/06-first-isomorphism-theorem/02-statement`, heading: /the first isomorphism theorem/i },
  { url: `${BASE}/06-first-isomorphism-theorem/03-embeddings`, heading: /injective homomorphisms as embeddings/i },
  // Section 7 — Problems
  { url: `${BASE}/07-problems/01-standard-problems`, heading: /problems.*standard/i },
  { url: `${BASE}/07-problems/02-more-standard`, heading: /problems.*order arguments/i },
  { url: `${BASE}/07-problems/03-starred-problems`, heading: /problems.*starred/i },
  { url: `${BASE}/07-problems/04-challenging-problems`, heading: /problems.*challenging/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Quotient groups — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Quotient groups — KaTeX renders', () => {
  test('kernel slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-homomorphisms/04-kernel`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Quotient groups — MCQ flow (kernel of mod-6 map)', () => {
  const SLIDE = `${BASE}/02-homomorphisms/06-homomorphism-mcq`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#quot-hom-mcq-kernel`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // 6ℤ is the correct kernel
    await page.getByRole('button', { name: /6ℤ/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // {0} is the kernel of an injective map — wrong here
    await page.getByRole('button', { name: /\{0\}/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Quotient groups — NumericInput flow (cosets of 3ℤ)', () => {
  const SLIDE = `${BASE}/03-cosets-and-modding-out/06-coset-exercise`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#quot-cos-num-cosets`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('5');
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
test.describe('Quotient groups — ProofReveal flow (x ∼ y iff xy⁻¹ ∈ N)', () => {
  const SLIDE = `${BASE}/03-cosets-and-modding-out/08-cosets-proofreveal`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#quot-cos-proof-equiv`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Suppose φ\(x\)/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Suppose φ\(x\)/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Suppose φ\(x\)/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Quotient groups — Problem flow (g² homomorphism)', () => {
  const SLIDE = `${BASE}/07-problems/01-standard-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#quot-prob-g-squared-hom`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "abelian" only appears in the solution text, not the prompt/hint
    await expect(article.getByText(/abelian/i).first()).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/abelian/i).first()).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
