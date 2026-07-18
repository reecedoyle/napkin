import { test, expect } from '@playwright/test';

const BASE = '/part-11-probability/03-stopped-martingales-to-do';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Stopped martingales — KaTeX renders', () => {
  test('optional stopping theorem slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/05-optional-stopping/03-optional-stopping-theorem`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Stopped martingales — MCQ flow (why doubling fails)', () => {
  const SLIDE = `${BASE}/01-how-to-make-money-almost-surely/02-what-this-chapter-covers`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#smt-s1-mcq-why-doubling-fails`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /unbounded money/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /coin isn't truly fair/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Stopped martingales — NumericInput flow (filtration cardinality)', () => {
  const SLIDE = `${BASE}/02-sub-sigma-algebras-and-filtrations/04-filtrations`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#smt-s2-num-f1-cardinality`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('2');
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
test.describe('Stopped martingales — ProofReveal flow (conditional expectation example)', () => {
  const SLIDE = `${BASE}/03-conditional-expectation/04-the-notation-is-terrible`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#smt-s3-proof-cond-exp-example`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/By symmetry of X and Y/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/By symmetry of X and Y/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/By symmetry of X and Y/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Stopped martingales — Problem flow (unbiased drunkard)', () => {
  const SLIDE = `${BASE}/07-problems/04-unbiased-drunkard`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#smt-prob-unbiased-drunkard`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "second martingale" only appears inside the solution text
    await expect(article.getByText(/second martingale/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/second martingale/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
