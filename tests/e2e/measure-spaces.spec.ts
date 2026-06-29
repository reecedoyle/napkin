import { test, expect } from '@playwright/test';

const BASE = '/part-10-measure-theory/01-measure-spaces';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Measure spaces — KaTeX renders', () => {
  test('examples-of-measures slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/05-measure-spaces/03-examples`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Measure spaces — MCQ flow (counting measure of {2,4,5} = 3)', () => {
  const SLIDE = `${BASE}/05-measure-spaces/03-examples`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#ms-meas-mcq-counting`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // correct answer is "b" → label "3" (three elements)
    await page.getByRole('button', { name: '3', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: '2', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Measure spaces — NumericInput flow (σ-algebra needs 2 axioms)', () => {
  const SLIDE = `${BASE}/05-measure-spaces/04-weaker-axioms`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#ms-meas-num-axioms`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('3');
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
test.describe('Measure spaces — ProofReveal flow (closed sets are Borel)', () => {
  const SLIDE = `${BASE}/04-sigma-algebras/04-borel-check`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#ms-sa-proof-closed-borel`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/closed if and only if its complement/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/closed if and only if its complement/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/closed if and only if its complement/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Measure spaces — Problem flow (countable intersection of measure-1 sets)', () => {
  const SLIDE = `${BASE}/09-problems/01-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#ms-prob-intersection-measure-one`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "sub-additivity" appears only inside the first problem's solution text
    await expect(article.getByText(/sub-additivity/i)).toBeHidden();

    // The measure-1-intersection Problem is the 1st on this slide.
    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/sub-additivity/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
