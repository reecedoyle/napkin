import { test, expect } from '@playwright/test';

const BASE = '/part-2-basic-abstract-algebra/03-ring-flavors';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Fields
  { url: `${BASE}/01-fields/01-what-is-a-field`, heading: /what is a field/i },
  { url: `${BASE}/01-fields/02-finite-fields`, heading: /finite fields/i },
  { url: `${BASE}/01-fields/03-ideals-in-a-field`, heading: /ideals in a field/i },
  { url: `${BASE}/01-fields/04-the-landscape`, heading: /the landscape/i },
  // Section 2 — Integral domains
  { url: `${BASE}/02-integral-domains/01-zero-divisors`, heading: /zero divisors/i },
  { url: `${BASE}/02-integral-domains/02-definition`, heading: /integral domains.*definition/i },
  { url: `${BASE}/02-integral-domains/03-cancellation`, heading: /cancellation/i },
  { url: `${BASE}/02-integral-domains/04-pids`, heading: /principal ideal domains/i },
  { url: `${BASE}/02-integral-domains/05-zn-check`, heading: /which.*are integral domains/i },
  // Section 3 — Prime ideals
  { url: `${BASE}/03-prime-ideals/01-motivation`, heading: /prime ideals.*motivation/i },
  { url: `${BASE}/03-prime-ideals/02-definition`, heading: /prime ideals.*definition/i },
  { url: `${BASE}/03-prime-ideals/03-quotient-theorem`, heading: /prime ideals and quotient rings/i },
  { url: `${BASE}/03-prime-ideals/04-zero-ideal-question`, heading: /when is.*0.*prime/i },
  { url: `${BASE}/03-prime-ideals/05-gaussian-integers`, heading: /prime ideal that is not prime/i },
  // Section 4 — Maximal ideals
  { url: `${BASE}/04-maximal-ideals/01-definition`, heading: /maximal ideals.*definition/i },
  { url: `${BASE}/04-maximal-ideals/02-quotient-theorem`, heading: /maximal ideals and quotient fields/i },
  { url: `${BASE}/04-maximal-ideals/03-maximal-implies-prime`, heading: /maximal implies prime/i },
  { url: `${BASE}/04-maximal-ideals/04-zero-ideal-maximal`, heading: /when is.*0.*maximal/i },
  { url: `${BASE}/04-maximal-ideals/05-modding-out`, heading: /using quotients to check maximality/i },
  // Section 5 — Field of fractions
  { url: `${BASE}/05-field-of-fractions/01-construction`, heading: /field of fractions.*construction/i },
  { url: `${BASE}/05-field-of-fractions/02-examples`, heading: /examples of fraction fields/i },
  { url: `${BASE}/05-field-of-fractions/03-why-integral-domain`, heading: /why we need an integral domain/i },
  { url: `${BASE}/05-field-of-fractions/04-rational-functions`, heading: /rational functions/i },
  // Section 6 — UFDs
  { url: `${BASE}/06-ufds/01-irreducible`, heading: /irreducible elements/i },
  { url: `${BASE}/06-ufds/02-definition`, heading: /unique factorization domains/i },
  { url: `${BASE}/06-ufds/03-pid-is-ufd`, heading: /every pid is a ufd/i },
  { url: `${BASE}/06-ufds/04-non-example`, heading: /non-example/i },
  { url: `${BASE}/06-ufds/05-polynomial-rings`, heading: /polynomial rings over ufds/i },
  // Section 7 — Euclidean domains
  { url: `${BASE}/07-euclidean-domains/01-algorithm`, heading: /euclidean algorithm revisited/i },
  { url: `${BASE}/07-euclidean-domains/02-definition`, heading: /euclidean domains.*definition/i },
  { url: `${BASE}/07-euclidean-domains/03-euclidean-is-pid`, heading: /every euclidean domain is a pid/i },
  { url: `${BASE}/07-euclidean-domains/04-gaussian-euclidean`, heading: /gaussian integers are euclidean/i },
  { url: `${BASE}/07-euclidean-domains/05-hierarchy-summary`, heading: /hierarchy.*summary/i },
  // Section 8 — Problems
  { url: `${BASE}/08-problems/01-intro-and-standard`, heading: /fields and homomorphisms/i },
  { url: `${BASE}/08-problems/02-starred`, heading: /starred/i },
  { url: `${BASE}/08-problems/03-krull-and-spec`, heading: /krull.*and.*spec/i },
  { url: `${BASE}/08-problems/04-daggered`, heading: /daggered/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Ring flavors — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Ring flavors — KaTeX renders', () => {
  test('field-of-fractions construction slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/05-field-of-fractions/01-construction`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Ring flavors — MCQ flow (which is a field)', () => {
  const SLIDE = `${BASE}/01-fields/01-what-is-a-field`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#flv-fields-mcq-which-is-field`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // ℤ is NOT a field — correct answer is "c"
    await page.getByRole('button', { name: /ℤ \(integers under \+ and ·\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // ℚ is a field — clicking it is wrong for the "NOT a field" question
    await page.getByRole('button', { name: /ℚ \(rationals under \+ and ·\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Ring flavors — NumericInput flow (smallest zero divisor in ℤ/15ℤ)', () => {
  const SLIDE = `${BASE}/02-integral-domains/05-zn-check`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#flv-id-num-z15-zero-div`;

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
test.describe('Ring flavors — ProofReveal flow (cancellation law)', () => {
  const SLIDE = `${BASE}/02-integral-domains/03-cancellation`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#flv-id-proof-cancellation`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Rearrange/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Rearrange/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Rearrange/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Ring flavors — Problem flow (ℚ[√2] is a field)', () => {
  const SLIDE = `${BASE}/08-problems/01-intro-and-standard`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#flv-prob-q-sqrt2-field`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "irrational" only appears inside the solution text, not the prompt/hint
    await expect(article.getByText(/irrational/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/irrational/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
