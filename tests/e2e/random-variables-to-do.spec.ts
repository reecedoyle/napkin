import { test, expect } from '@playwright/test';

const BASE = '/part-11-probability/01-random-variables-to-do';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Random variables — KaTeX renders', () => {
  test('expected-value slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-random-variables/02-expected-value-and-moments`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Random variables — MCQ flow (definition of random variable)', () => {
  const SLIDE = `${BASE}/01-random-variables/05-check-your-understanding`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#rv-s1-mcq-rv-definition`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // "A measurable function X : Ω → ℝ" is the correct answer (b)
    await page.getByRole('button', { name: /measurable function/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // "A real number drawn uniformly at random" is wrong
    await page.getByRole('button', { name: /real number drawn uniformly/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Random variables — NumericInput flow (indicator expectation)', () => {
  const SLIDE = `${BASE}/01-random-variables/05-check-your-understanding`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#rv-s1-num-indicator-expectation`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a decimal').first();
    await input.fill('0.5');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('0.3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('0.3');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Random variables — ProofReveal flow (indicator expectation proof)', () => {
  const SLIDE = `${BASE}/01-random-variables/03-indicator-random-variable`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#rv-s1-proof-indicator-expectation`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/equals the probability of A/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/equals the probability of A/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/equals the probability of A/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Random variables — Problem flow (equidistribution)', () => {
  const SLIDE = `${BASE}/02-problems/01-equidistribution`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#rv-prob-equidistribution`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "countable union of null sets" only appears inside the solution text
    await expect(article.getByText(/countable union of null sets/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/countable union of null sets/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
