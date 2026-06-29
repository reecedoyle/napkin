import { test, expect } from '@playwright/test';

const BASE = '/part-10-measure-theory/03-lebesgue-integration';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Lebesgue integration — KaTeX renders', () => {
  test('indicator-function slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-the-definition/02-indicator-functions`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Lebesgue integration — MCQ flow (∫ 𝟏_[2,5] dμ = 3)', () => {
  const SLIDE = `${BASE}/01-the-definition/02-indicator-functions`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#leb-def-mcq-indicator-value`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // correct answer is "b" → label "3" (length of [2,5])
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
    await page.getByRole('button', { name: '∞', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Lebesgue integration — NumericInput flow (∫_(0,4) x^{-1/2} dμ = 4)', () => {
  const SLIDE = `${BASE}/03-relation-to-riemann/04-example-1-over-sqrt-x`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#leb-rim-num-sqrt-x`;

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
test.describe('Lebesgue integration — ProofReveal flow (|f| = |f⁺| + |f⁻| split)', () => {
  const SLIDE = `${BASE}/01-the-definition/06-general-functions`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#leb-def-proof-abs-int-split`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/monotonicity and linearity of the integral/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/monotonicity and linearity of the integral/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/monotonicity and linearity of the integral/i)).toBeVisible();
  });
});
