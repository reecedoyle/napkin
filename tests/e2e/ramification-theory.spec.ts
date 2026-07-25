import { test, expect } from '@playwright/test';

const BASE = '/part-15-algebraic-nt-ii-galois-and-ramification-theory/03-ramification-theory';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Ramification theory — KaTeX renders', () => {
  test('inertial degree definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-inertial-degrees/02-defining-inertial-degree`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Ramification theory — MCQ flow (classify 13 in ℤ[i])', () => {
  const SLIDE = `${BASE}/01-ramified-inert-split/03-classify-thirteen`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#rt60-s1-mcq-classify-13`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: 'Split', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: 'Inert', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Ramification theory — NumericInput flow (which prime ramifies in ℚ(√-3))', () => {
  const SLIDE = `${BASE}/02-discriminant-detects-ramification/04-exercise-which-prime-ramifies`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#rt60-s2-num-ramified-prime`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('2');
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
test.describe('Ramification theory — ProofReveal flow (mod-4 pattern in ℤ[i])', () => {
  const SLIDE = `${BASE}/01-ramified-inert-split/04-proving-the-pattern`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#rt60-s1-proof-mod4-pattern`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/irreducible mod p, so \(p\) stays prime/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/irreducible mod p, so \(p\) stays prime/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/irreducible mod p, so \(p\) stays prime/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Ramification theory — Problem flow (inert primes need cyclic Galois groups)', () => {
  const SLIDE = `${BASE}/07-problems/01-inert-primes-and-cyclic-groups`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#rt60-prob-inert-splitting-field`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "Frobenius map" only appears inside the solution text, not the prompt/hint
    await expect(article.getByText(/Frobenius map/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/Frobenius map/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
