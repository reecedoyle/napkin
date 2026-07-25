import { test, expect } from '@playwright/test';

const BASE = '/part-15-algebraic-nt-ii-galois-and-ramification-theory/02-finite-fields';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Finite fields — KaTeX renders', () => {
  test('characteristic definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-example-of-a-finite-field/02-characteristic`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Finite fields — MCQ flow (characteristic vs. size)', () => {
  const SLIDE = `${BASE}/01-example-of-a-finite-field/05-characteristic-of-f9`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#ff59-ex1-mcq-char-vs-size`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // "The number of elements is a power of the characteristic" is correct
    await page
      .getByRole('button', { name: 'The number of elements is a power of the characteristic', exact: true })
      .click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page
      .getByRole('button', { name: 'The characteristic must always be even', exact: true })
      .click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Finite fields — NumericInput flow (quadratic residues in 𝔽_17)', () => {
  const SLIDE = `${BASE}/05-multiplicative-group-of-a-finite-field/03-quadratic-residues-in-f17`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#ff59-s5-num-count-qr-f17`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('16');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('8');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('8');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Finite fields — ProofReveal flow (characteristic is prime)', () => {
  const SLIDE = `${BASE}/02-finite-fields-have-prime-power-order/01-characteristic-is-prime`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#ff59-s2-proof-char-prime`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/contradicting that F is a field/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/contradicting that F is a field/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/contradicting that F is a field/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Finite fields — Problem flow (Fibonacci period mod 127)', () => {
  const SLIDE = `${BASE}/06-problems/01-fibonacci-period`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#ff59-prob-fibonacci-period-127`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "the period is exactly 256" only appears inside the solution, not the prompt/hint
    await expect(article.getByText(/the period is exactly 256/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/the period is exactly 256/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
