import { test, expect } from '@playwright/test';

const BASE = '/part-13-riemann-surfaces/02-morphisms-between-riemann-surfaces';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Morphisms between Riemann surfaces — KaTeX renders', () => {
  test('definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-definition/01-what-is-a-morphism`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Morphisms — MCQ flow (which map is not a morphism)', () => {
  const SLIDE = `${BASE}/01-definition/02-examples`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#rs48-def-mcq-morphism-check`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // z ↦ |z| is NOT a morphism — correct answer is "c"
    await page.getByRole('button', { name: /z ↦ \|z\| on ℂ/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // z ↦ z² is a morphism — clicking it is wrong for the "NOT a morphism" question
    await page.getByRole('button', { name: /z ↦ z² on ℂ/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Morphisms — NumericInput flow (degree of z³)', () => {
  const SLIDE = `${BASE}/03-some-other-nice-properties/03-degree-example`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#rs48-nice-num-degree-z3`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('2');
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
test.describe('Morphisms — ProofReveal flow (identity theorem rigidity)', () => {
  const SLIDE = `${BASE}/07-identity-theorem/02-rigidity`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#rs48-identity-proof-rigid`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText('because f and g are continuous')).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText('because f and g are continuous')).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText('because f and g are continuous')).toBeVisible();
  });
});
