import { test, expect } from '@playwright/test';

const BASE = '/part-10-measure-theory/04-swapping-order-with-lebesgue-integrals';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Swapping order — KaTeX renders', () => {
  test('Fatou statement slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-fatous-lemma/02-statement`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Swapping order — MCQ flow (pointwise convergence not enough)', () => {
  const SLIDE = `${BASE}/01-motivating-limit-interchange/03-why-swap-limits`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#swap-mot-mcq-when-legal`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // correct answer is "b" — extra conditions are needed
    await page.getByRole('button', { name: 'False — extra conditions are needed', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: 'True — pointwise convergence always lets you swap', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Swapping order — NumericInput flow (∫√x dx = 2/3)', () => {
  const SLIDE = `${BASE}/04-monotone-and-dominated-convergence/06-dct-example`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#swap-dct-num-integral`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('1/2');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('2/3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('2/3');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Swapping order — ProofReveal flow (where is the dominator used)', () => {
  const SLIDE = `${BASE}/04-monotone-and-dominated-convergence/08-fatou-exercise`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#swap-dct-proof-dominator`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/subtraction is only valid/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/subtraction is only valid/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/subtraction is only valid/i)).toBeVisible();
  });
});
