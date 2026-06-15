import { test, expect } from '@playwright/test';

const BASE = '/part-2-basic-abstract-algebra/03-ring-flavors';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
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
