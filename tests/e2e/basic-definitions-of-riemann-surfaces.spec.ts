import { test, expect } from '@playwright/test';

const BASE = '/part-13-riemann-surfaces/01-basic-definitions-of-riemann-surfaces';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Basic definitions of Riemann surfaces — KaTeX renders', () => {
  test('definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-riemann-surface/01-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Basic definitions of Riemann surfaces — MCQ flow (which is not a Riemann surface)', () => {
  const SLIDE = `${BASE}/04-examples-of-riemann-surfaces/07-examples-mcq`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#rs47-ex-mcq-which-is-rs`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // disjoint union is NOT a Riemann surface — correct answer is "c"
    await page.getByRole('button', { name: /The disjoint union of two copies of ℂ/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // ℂ itself is a valid Riemann surface — clicking it is wrong
    await page.getByRole('button', { name: /ℂ itself/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Basic definitions of Riemann surfaces — NumericInput flow (real dimension of complex 3-manifold)', () => {
  const SLIDE = `${BASE}/03-complex-manifold/02-rigidity`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#rs47-cm-num-real-dim`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('6');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('6');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Basic definitions of Riemann surfaces — ProofReveal flow (analytic transition maps)', () => {
  const SLIDE = `${BASE}/02-riemann-surface/05-transition-maps-analytic`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#rs47-rs-proof-analytic-rigid`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/a composition of holomorphic functions is holomorphic/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/a composition of holomorphic functions is holomorphic/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/a composition of holomorphic functions is holomorphic/i)).toBeVisible();
  });
});
