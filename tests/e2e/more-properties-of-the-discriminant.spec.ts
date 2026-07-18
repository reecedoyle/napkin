import { test, expect } from '@playwright/test';

const BASE = '/part-14-algebraic-nt-i-rings-of-integers/05-more-properties-of-the-discriminant';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('More properties of the discriminant — KaTeX renders', () => {
  test('intro slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-the-discriminant-definition/01-what-is-the-discriminant`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('More properties of the discriminant — MCQ flow (discriminant of ℚ(√-3))', () => {
  const SLIDE = `${BASE}/01-the-discriminant-definition/02-quick-examples`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#an57-intro-mcq-sign`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Correct answer is "d" — −3, because −3 ≡ 1 mod 4
    await page.getByRole('button', { name: /−3, because −3 ≡ 1 mod 4/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // Clicking "−12" is wrong
    await page.getByRole('button', { name: /−12/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── Problem flow — cyclotomic field ───────────────────────────────────────────
test.describe('More properties of the discriminant — Problem flow (cyclotomic field)', () => {
  const SLIDE = `${BASE}/02-problems/01-cyclotomic-field`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#an57-prob-cyclotomic`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);
    const article = page.getByRole('article');

    // "Vandermonde determinant formula" only appears inside the solution text
    await expect(article.getByText(/Vandermonde determinant formula/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/Vandermonde determinant formula/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});

// ── Problem flow — Stickelberger ──────────────────────────────────────────────
test.describe('More properties of the discriminant — Problem flow (Stickelberger)', () => {
  const SLIDE = `${BASE}/02-problems/03-absolute-value-brill-stickelberger`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#an57-prob-stickelberger`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);
    const article = page.getByRole('article');

    // "permanent P + N" only appears in the Stickelberger solution text
    await expect(article.getByText(/permanent P \+ N/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).last().click();
    await expect(article.getByText(/permanent P \+ N/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
