import { test, expect } from '@playwright/test';

const BASE = '/part-5-more-on-groups/03-pid-structure';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Finitely generated abelian groups
  { url: `${BASE}/01-fg-abelian-groups/01-what-is-finitely-generated`, heading: /finitely generated abelian groups.*what are they/i },
  { url: `${BASE}/01-fg-abelian-groups/02-classification-theorem`, heading: /classification of finitely generated abelian groups/i },
  { url: `${BASE}/01-fg-abelian-groups/03-rank-definition`, heading: /rank of a finitely generated abelian group/i },
  // Section 2 — Ring theory prerequisites
  { url: `${BASE}/02-ring-prerequisites/01-prime-elements`, heading: /prime elements in a ufd/i },
  { url: `${BASE}/02-ring-prerequisites/02-pid-is-noetherian-ufd`, heading: /pids are noetherian ufds/i },
  { url: `${BASE}/02-ring-prerequisites/03-noetherian-modules`, heading: /noetherian modules/i },
  // Section 3 — The structure theorem
  { url: `${BASE}/03-structure-theorem/01-invariant-form`, heading: /structure theorem.*invariant factor form/i },
  { url: `${BASE}/03-structure-theorem/02-primary-form`, heading: /structure theorem.*primary decomposition form/i },
  { url: `${BASE}/03-structure-theorem/03-corollaries`, heading: /what the structure theorem explains/i },
  // Section 4 — Reduction to free modules
  { url: `${BASE}/04-free-module-reduction/01-surjection-from-free`, heading: /surjection trick/i },
  { url: `${BASE}/04-free-module-reduction/02-noetherian-direct-sum`, heading: /direct sums of noetherian modules are noetherian/i },
  { url: `${BASE}/04-free-module-reduction/03-cokernel-picture`, heading: /m as a cokernel/i },
  // Section 5 — Uniqueness
  { url: `${BASE}/05-uniqueness-primary-form/01-uniqueness-free-rank`, heading: /uniqueness.*free rank is well-defined/i },
  { url: `${BASE}/05-uniqueness-primary-form/02-torsion-submodule`, heading: /uniqueness.*torsion submodule/i },
  { url: `${BASE}/05-uniqueness-primary-form/03-uniqueness-prime-power-exponents`, heading: /uniqueness.*prime power exponents/i },
  // Section 6 — Smith normal form
  { url: `${BASE}/06-smith-normal-form/01-basis-changes`, heading: /allowed basis changes/i },
  { url: `${BASE}/06-smith-normal-form/02-theorem-statement`, heading: /smith normal form.*the theorem/i },
  { url: `${BASE}/06-smith-normal-form/03-worked-example`, heading: /worked example over ℤ/i },
  { url: `${BASE}/06-smith-normal-form/04-proof-sketch`, heading: /proof via the euclidean algorithm/i },
  // Section 7 — Problems
  { url: `${BASE}/07-problems/01-daggered`, heading: /problems.*daggered/i },
  { url: `${BASE}/07-problems/02-standard`, heading: /problems.*standard/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('PID structure theorem — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('PID structure theorem — KaTeX renders', () => {
  test('invariant form slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-structure-theorem/01-invariant-form`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('PID structure theorem — MCQ flow (rank of ℤ ⊕ ℤ/4ℤ ⊕ ℤ/9ℤ)', () => {
  const SLIDE = `${BASE}/01-fg-abelian-groups/03-rank-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#pid-fg-mcq-rank`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // rank is 1 — one free ℤ summand
    await page.getByRole('button', { name: /^1$/ }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // rank 3 is wrong
    await page.getByRole('button', { name: /^3$/ }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('PID structure theorem — NumericInput flow (minimum generators of ℤ/3ℤ ⊕ ℤ/5ℤ)', () => {
  const SLIDE = `${BASE}/01-fg-abelian-groups/02-classification-theorem`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#pid-fg-num-z3z5-generators`;

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
test.describe('PID structure theorem — ProofReveal flow (Noetherian direct sum)', () => {
  const SLIDE = `${BASE}/04-free-module-reduction/02-noetherian-direct-sum`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#pid-free-proof-rdn-noetherian`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/generators of A and generators of B/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/generators of A and generators of B/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/generators of A and generators of B/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('PID structure theorem — Problem flow (vector spaces are isomorphic)', () => {
  const SLIDE = `${BASE}/07-problems/01-daggered`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#pid-prob-vector-spaces-iso`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "contributing a free summand" only appears inside the solution text
    await expect(article.getByText(/contributing a free summand/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/contributing a free summand/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
