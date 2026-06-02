import { test, expect } from '@playwright/test';

const BASE = '/part-4-linear-algebra/06-fourier';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Synopsis
  { url: `${BASE}/01-synopsis/01-the-big-idea`, heading: /the big idea.*fourier/i },
  { url: `${BASE}/01-synopsis/02-characters-and-frequencies`, heading: /characters and frequencies/i },
  { url: `${BASE}/01-synopsis/03-the-circle-group`, heading: /the circle group/i },
  { url: `${BASE}/01-synopsis/04-synopsis-mcq`, heading: /synopsis.*check/i },
  // Section 2 — Hilbert spaces
  { url: `${BASE}/02-hilbert-spaces/01-hilbert-space`, heading: /hilbert spaces/i },
  { url: `${BASE}/02-hilbert-spaces/02-orthonormal-basis-facts`, heading: /facts about orthonormal bases/i },
  { url: `${BASE}/02-hilbert-spaces/03-infinite-vs-finite`, heading: /finite vs.*infinite/i },
  // Section 3 — Common examples
  { url: `${BASE}/03-common-examples/01-binary-setup`, heading: /binary fourier analysis.*setup/i },
  { url: `${BASE}/03-common-examples/02-multilinear-polynomials`, heading: /multilinear polynomials/i },
  { url: `${BASE}/03-common-examples/03-binary-example`, heading: /binary fourier.*worked example/i },
  { url: `${BASE}/03-common-examples/04-finite-groups`, heading: /fourier analysis on finite abelian groups/i },
  { url: `${BASE}/03-common-examples/05-group-characters`, heading: /group characters are orthonormal/i },
  { url: `${BASE}/03-common-examples/06-fourier-series-L2`, heading: /fourier series on/i },
  // Section 4 — Summary
  { url: `${BASE}/04-summary/01-summary-table`, heading: /summary table/i },
  { url: `${BASE}/04-summary/02-dual-group-teaser`, heading: /pontryagin duality/i },
  // Section 5 — Parseval
  { url: `${BASE}/05-parseval/01-parseval-theorem`, heading: /parseval/i },
  { url: `${BASE}/05-parseval/02-fourier-inversion`, heading: /fourier inversion/i },
  { url: `${BASE}/05-parseval/03-plancherel`, heading: /plancherel/i },
  // Section 6 — Basel problem
  { url: `${BASE}/06-basel-problem/01-setup`, heading: /basel problem.*setup/i },
  { url: `${BASE}/06-basel-problem/02-computing-coefficients`, heading: /computing the fourier coefficients/i },
  { url: `${BASE}/06-basel-problem/03-conclusion`, heading: /basel problem.*conclusion/i },
  // Section 7 — Arrow's theorem
  { url: `${BASE}/07-arrows-theorem/01-voting-setup`, heading: /arrow.*voting setup/i },
  { url: `${BASE}/07-arrows-theorem/02-theorem-statement`, heading: /arrow.*statement/i },
  { url: `${BASE}/07-arrows-theorem/03-proof-inequality`, heading: /arrow.*fourier proof/i },
  { url: `${BASE}/07-arrows-theorem/04-proof-conclusion`, heading: /arrow.*conclusion/i },
  // Section 8 — Problems
  { url: `${BASE}/08-problems/01-standard-problem`, heading: /problems.*basel and arrow/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Fourier — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Fourier — KaTeX renders', () => {
  test('Parseval theorem slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/05-parseval/01-parseval-theorem`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Fourier — MCQ flow (physical variable)', () => {
  const SLIDE = `${BASE}/01-synopsis/04-synopsis-mcq`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#four-synopsis-mcq-roles`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // x ∈ Z is the physical variable — correct answer is "b"
    await page.getByRole('button', { name: /x ∈ Z \(the input to f\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // ξ is the frequency variable, not the physical variable — clicking it is wrong
    await page.getByRole('button', { name: /ξ \(the frequency variable\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Fourier — NumericInput flow (average value f̂(∅))', () => {
  const SLIDE = `${BASE}/03-common-examples/03-binary-example`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#four-ex-binary-num-avg`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('0.5');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('0.25');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('0.25');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Fourier — ProofReveal flow (orthonormal basis facts)', () => {
  const SLIDE = `${BASE}/02-hilbert-spaces/02-orthonormal-basis-facts`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#four-hilbert-proof-onb-facts`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/standard expansion formula/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/standard expansion formula/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/standard expansion formula/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Fourier — Problem flow (Basel extension)', () => {
  const SLIDE = `${BASE}/08-problems/01-standard-problem`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#four-prob-sum-n4`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "integration by parts twice" only appears inside the solution text
    await expect(article.getByText(/integration by parts twice/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/integration by parts twice/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
