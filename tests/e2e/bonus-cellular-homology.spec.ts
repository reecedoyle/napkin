import { test, expect } from '@playwright/test';

const BASE = '/part-18-algebraic-topology-ii-homology/04-bonus-cellular-homology';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Bonus: cellular homology — KaTeX renders', () => {
  test('CW homology lemma slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-cellular-chain-complex/01-cw-homology-lemma`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Bonus: cellular homology — MCQ flow (degree of the antipodal map on S²)', () => {
  const SLIDE = `${BASE}/01-degrees/03-wrapping-moral-and-examples`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#bch73-deg-mcq-antipodal-s2`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // degree is (-1)^(n+1); for n=2 that's -1 — correct answer is "b"
    await page.getByRole('button', { name: '-1', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: '1', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Bonus: cellular homology — NumericInput flow (rank of H_1(torus))', () => {
  const SLIDE = `${BASE}/05-cellular-boundary-formula/07-torus-d2-and-homology`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#bch73-boundary-num-torus-h1-rank`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('1');
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
test.describe('Bonus: cellular homology — ProofReveal flow (degree is multiplicative)', () => {
  const SLIDE = `${BASE}/01-degrees/02-degree-is-multiplicative`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#bch73-deg-proof-composition-multiplicative`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Functoriality of homology gives/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Functoriality of homology gives/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Functoriality of homology gives/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Bonus: cellular homology — Problem flow (non-surjective maps have degree zero)', () => {
  const SLIDE = `${BASE}/06-problems/02-nonsurjective-degree-zero`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#bch73-problems-standard-nonsurjective-degree-zero`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "the composite is the zero map" only appears inside the solution text
    await expect(article.getByText(/the composite is the zero map/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/the composite is the zero map/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
