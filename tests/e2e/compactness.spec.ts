import { test, expect } from '@playwright/test';

const BASE = '/part-3-basic-topology/03-compactness';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Sequential compactness
  { url: `${BASE}/01-sequential-compactness/01-what-is-compactness`, heading: /what is compactness/i },
  { url: `${BASE}/01-sequential-compactness/02-subsequences`, heading: /subsequences/i },
  { url: `${BASE}/01-sequential-compactness/03-definition`, heading: /sequential compactness.*definition/i },
  { url: `${BASE}/01-sequential-compactness/04-non-examples`, heading: /non-examples of compact spaces/i },
  { url: `${BASE}/01-sequential-compactness/05-examples`, heading: /examples of compact spaces/i },
  // Section 2 — Criteria for compactness
  { url: `${BASE}/02-criteria-for-compactness/01-interval-compact`, heading: /the interval is compact/i },
  { url: `${BASE}/02-criteria-for-compactness/02-tychonoff`, heading: /tychonoff.*theorem/i },
  { url: `${BASE}/02-criteria-for-compactness/03-bolzano-weierstrass`, heading: /bolzano.*weierstra/i },
  // Section 3 — Open covers
  { url: `${BASE}/03-open-covers/01-open-cover-definition`, heading: /open covers.*definition/i },
  { url: `${BASE}/03-open-covers/02-compact-definition`, heading: /compact spaces.*open-cover definition/i },
  { url: `${BASE}/03-open-covers/03-non-compactness-example`, heading: /non-compactness via open covers/i },
  // Section 4 — Applications
  { url: `${BASE}/04-applications/01-totally-bounded`, heading: /compact implies totally bounded/i },
  { url: `${BASE}/04-applications/02-images-of-compacts`, heading: /images of compact spaces/i },
  { url: `${BASE}/04-applications/03-extreme-value`, heading: /extreme and intermediate value/i },
  { url: `${BASE}/04-applications/04-uniform-continuity`, heading: /uniform continuity$/i },
  { url: `${BASE}/04-applications/05-uniform-continuity-proof`, heading: /uniform continuity proof/i },
  // Section 5 — Equivalence (optional)
  { url: `${BASE}/05-equivalence/01-heine-borel`, heading: /heine-borel for general metric spaces/i },
  { url: `${BASE}/05-equivalence/02-lebesgue-number`, heading: /lebesgue number lemma/i },
  // Section 6 — Problems
  { url: `${BASE}/06-problems/01-standard`, heading: /homeomorphisms and discrete spaces/i },
  { url: `${BASE}/06-problems/02-cofinite-and-cantor`, heading: /cofinite topology and cantor intersection/i },
  { url: `${BASE}/06-problems/03-tychonoff-problem`, heading: /tychonoff and bolzano/i },
  { url: `${BASE}/06-problems/04-arzela-ascoli`, heading: /arzel[àa]-ascoli/i },
  { url: `${BASE}/06-problems/05-circles`, heading: /partitioning the plane by circles/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Compactness — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Compactness — KaTeX renders', () => {
  test('open-cover definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-open-covers/01-open-cover-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Compactness — MCQ flow (which ℝ² subset is compact)', () => {
  const SLIDE = `${BASE}/02-criteria-for-compactness/03-bolzano-weierstrass`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#cpt-crit-mcq-bw`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Closed disk is compact — correct answer is "b"
    await page.getByRole('button', { name: /closed disk/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // Open disk is not compact — clicking it is wrong
    await page.getByRole('button', { name: /open disk/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Compactness — NumericInput flow (uniform continuity δ)', () => {
  const SLIDE = `${BASE}/04-applications/05-uniform-continuity-proof`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#cpt-app-num-uniform-delta`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('0.3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('0.2');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('0.2');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Compactness — ProofReveal flow (Tychonoff)', () => {
  const SLIDE = `${BASE}/02-criteria-for-compactness/02-tychonoff`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#cpt-crit-proof-tychonoff`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/already-filtered/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/already-filtered/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/already-filtered/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Compactness — Problem flow ([0,1] vs (0,1) not homeomorphic)', () => {
  const SLIDE = `${BASE}/06-problems/01-standard`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#cpt-prob-closed-open-not-homeo`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "preserved under homeomorphism" only appears inside the solution text
    await expect(article.getByText(/preserved under homeomorphism/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/preserved under homeomorphism/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
