import { test, expect } from '@playwright/test';

const BASE = '/part-9-complex-analysis/03-holomorphic-square-roots-and-logarithms';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Holomorphic square roots and logarithms — KaTeX renders', () => {
  test('monodromy slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-square-roots-of-holomorphic-functions/03-monodromy-and-winding`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Holomorphic square roots and logarithms — MCQ flow (two-root problem)', () => {
  const SLIDE = `${BASE}/01-motivation/01-the-two-root-problem`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#hsl-mot-mcq-two-roots`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // correct answer: complex numbers have no natural ordering
    await page.getByRole('button', { name: /Complex numbers have no natural ordering/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // wrong answer: more than two square roots
    await page.getByRole('button', { name: /Complex numbers have more than two square roots/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Holomorphic square roots and logarithms — NumericInput flow (winding number)', () => {
  const SLIDE = `${BASE}/02-square-roots-of-holomorphic-functions/03-monodromy-and-winding`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#hsl-sqr-num-winding-circle`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('2');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('1');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('1');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Holomorphic square roots and logarithms — ProofReveal flow (nth root theorem)', () => {
  const SLIDE = `${BASE}/03-covering-projections/03-nth-root-theorem`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#hsl-cov-proof-nth-root`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/a covering projection of degree n/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/a covering projection of degree n/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/the image of π₁ in the base is nℤ/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Holomorphic square roots and logarithms — Problem flow (log iff nth roots)', () => {
  const SLIDE = `${BASE}/06-problems/01-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#hsl-prob-log-iff-nth-roots`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "An integer divisible by every positive integer" only appears in the solution text
    await expect(article.getByText(/An integer divisible by every positive integer/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/An integer divisible by every positive integer/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
