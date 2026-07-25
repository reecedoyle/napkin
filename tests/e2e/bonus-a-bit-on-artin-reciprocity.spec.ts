import { test, expect } from '@playwright/test';

const BASE = '/part-15-algebraic-nt-ii-galois-and-ramification-theory/05-bonus-a-bit-on-artin-reciprocity';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Artin reciprocity — KaTeX renders', () => {
  test('the Artin symbol preview slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-overview/02-preview-the-artin-symbol`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Artin reciprocity — MCQ flow (which field is totally complex)', () => {
  const SLIDE = `${BASE}/02-infinite-primes/03-check-your-understanding`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#artin-inf-mcq-totally-complex`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // ℚ(√-5) is totally complex — correct answer is "b"
    await page.getByRole('button', { name: 'ℚ(√-5)', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // ℚ(√5) is totally real — clicking it is wrong for the "totally complex" question
    await page.getByRole('button', { name: 'ℚ(√5)', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Artin reciprocity — NumericInput flow (order of C_ℚ(8∞))', () => {
  const SLIDE = `${BASE}/03-modular-arithmetic-with-infinite-primes/05-example-infinite-modulus`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#artin-mod-num-order-c8inf`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('4');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('4');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Artin reciprocity — ProofReveal flow (totally complex fields stay unramified)', () => {
  const SLIDE = `${BASE}/04-infinite-primes-in-extensions/03-example-and-a-proof`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#artin-inf-proof-totally-complex-unramified`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/nothing left to ramify/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/nothing left to ramify/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/nothing left to ramify/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Artin reciprocity — Problem flow (Hilbert class field existence)', () => {
  const SLIDE = `${BASE}/08-problems/02-hilbert-class-field`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#artin-prob-hilbert-class-field`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "Isomorphism with the class group" only appears inside the solution text.
    await expect(article.getByText(/Isomorphism with the class group/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/Isomorphism with the class group/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
