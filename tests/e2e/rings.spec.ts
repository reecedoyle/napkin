import { test, expect } from '@playwright/test';

const BASE = '/part-2-basic-abstract-algebra/02-rings';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Motivation
  { url: `${BASE}/01-motivation/01-rings-vs-groups`, heading: /rings vs groups/i },
  { url: `${BASE}/01-motivation/02-prototype-is-ZZ`, heading: /prototype ring is ℤ/i },
  // Section 2 — Definition
  { url: `${BASE}/02-definition/01-ring-definition`, heading: /definition of a ring/i },
  { url: `${BASE}/02-definition/02-first-examples`, heading: /first examples of rings/i },
  { url: `${BASE}/02-definition/03-polynomial-ring`, heading: /polynomial rings/i },
  { url: `${BASE}/02-definition/04-more-examples`, heading: /gaussian integers and products/i },
  { url: `${BASE}/02-definition/05-zero-ring-and-basic-facts`, heading: /zero ring and basic ring facts/i },
  // Section 3 — Fields
  { url: `${BASE}/03-fields/01-units-and-fields`, heading: /units and fields/i },
  { url: `${BASE}/03-fields/02-examples-of-fields`, heading: /examples of fields/i },
  // Section 4 — Homomorphisms
  { url: `${BASE}/04-homomorphisms/01-definition`, heading: /ring homomorphisms.*definition/i },
  { url: `${BASE}/04-homomorphisms/02-examples`, heading: /ring homomorphism examples/i },
  { url: `${BASE}/04-homomorphisms/03-kernel-and-first-iso`, heading: /first isomorphism theorem for rings/i },
  // Section 5 — Ideals
  { url: `${BASE}/05-ideals/01-kernel`, heading: /kernel of a ring homomorphism/i },
  { url: `${BASE}/05-ideals/02-definition`, heading: /ideals.*definition/i },
  { url: `${BASE}/05-ideals/03-quotient-ring`, heading: /quotient rings/i },
  { url: `${BASE}/05-ideals/04-fields-have-two-ideals`, heading: /ideals in a field/i },
  { url: `${BASE}/05-ideals/05-gaussian-integers-as-quotient`, heading: /gaussian integers as a quotient ring/i },
  // Section 6 — Generating ideals
  { url: `${BASE}/06-generating-ideals/01-generated-ideals-definition`, heading: /generated ideals/i },
  { url: `${BASE}/06-generating-ideals/02-ideals-in-ZZ`, heading: /ideals in ℤ/i },
  { url: `${BASE}/06-generating-ideals/03-quotients-by-generated-ideals`, heading: /quotients by generated ideals/i },
  { url: `${BASE}/06-generating-ideals/04-ideal-sum-and-intersection`, heading: /sums and intersections of ideals/i },
  // Section 7 — PIDs
  { url: `${BASE}/07-pids/01-non-principal-ideal`, heading: /non-principal ideal/i },
  { url: `${BASE}/07-pids/02-pid-definition`, heading: /principal ideal domains/i },
  { url: `${BASE}/07-pids/03-pid-and-gcd`, heading: /pids and gcds/i },
  // Section 8 — Noetherian
  { url: `${BASE}/08-noetherian/01-non-noetherian-example`, heading: /rings with infinitely generated ideals/i },
  { url: `${BASE}/08-noetherian/02-noetherian-definition`, heading: /noetherian rings.*definition/i },
  { url: `${BASE}/08-noetherian/03-hilbert-basis-theorem`, heading: /hilbert basis theorem/i },
  { url: `${BASE}/08-noetherian/04-noetherian-examples`, heading: /which rings are noetherian/i },
  // Section 9 — Problems
  { url: `${BASE}/09-problems/01-standard`, heading: /problems.*standard/i },
  { url: `${BASE}/09-problems/02-starred`, heading: /problems.*starred/i },
  { url: `${BASE}/09-problems/03-challenge`, heading: /problems.*challenge/i },
  { url: `${BASE}/09-problems/04-usa-tst`, heading: /usa team selection test/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Rings and ideals — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Rings and ideals — KaTeX renders', () => {
  test('ring definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-definition/01-ring-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Rings and ideals — MCQ flow (ring axioms)', () => {
  const SLIDE = `${BASE}/02-definition/01-ring-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#rng-def-mcq-axioms`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // "every nonzero element has a multiplicative inverse" is NOT a ring axiom — correct = "c"
    await page.getByRole('button', { name: /every nonzero element has a multiplicative inverse/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // "(R, +) is an abelian group" IS a ring axiom — clicking it is wrong for "NOT part of definition"
    await page.getByRole('button', { name: /\(R, \+\) is an abelian group/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Rings and ideals — NumericInput flow (units of ℤ/7ℤ)', () => {
  const SLIDE = `${BASE}/03-fields/02-examples-of-fields`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#rng-fields-num-fp-units`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('7');
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
test.describe('Rings and ideals — ProofReveal flow (ideals in a field)', () => {
  const SLIDE = `${BASE}/05-ideals/04-fields-have-two-ideals`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#rng-ideals-proof-field-ideals`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/If I = \(0\)/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/If I = \(0\)/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/If I = \(0\)/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Rings and ideals — Problem flow (ℝ[x]/(x²+1) is ℂ)', () => {
  const SLIDE = `${BASE}/09-problems/01-standard`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#rng-prob-Rx-mod-x2plus1`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "isomorphism" only appears inside the solution text, not the prompt/hint
    await expect(article.getByText(/isomorphism is given by/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/isomorphism is given by/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
