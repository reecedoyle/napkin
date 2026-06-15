import { test, expect } from '@playwright/test';

const BASE = '/part-4-linear-algebra/03-dual-and-trace';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Dual space and trace — KaTeX renders', () => {
  test('basis-and-dimension slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-tensor-product/04-basis-and-dimension`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Dual space and trace — MCQ flow (scalar passing)', () => {
  const SLIDE = `${BASE}/01-tensor-product/03-pure-tensor-notation`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#dat-tp-mcq-scalar-pass`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Option (a) "6(e₁ ⊗ f₁)" is correct
    await page.getByRole('button', { name: /6\(e₁ ⊗ f₁\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // Option (d) is wrong
    await page.getByRole('button', { name: /It cannot be simplified/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Dual space and trace — NumericInput flow (dim V ⊗ W)', () => {
  const SLIDE = `${BASE}/01-tensor-product/04-basis-and-dimension`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#dat-tp-num-dim`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
    await input.fill('11');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('28');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('28');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Dual space and trace — ProofReveal flow (dim V∨ = dim V)', () => {
  const SLIDE = `${BASE}/02-dual-space/03-iso-is-unnatural`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#dat-ds-proof-dim-vee`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/dual basis e₁∨/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/dual basis e₁∨/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/dual basis e₁∨/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Dual space and trace — Problem flow (trace = sum of eigenvalues)', () => {
  const SLIDE = `${BASE}/05-problems/01-standard`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#dat-prob-trace-eigenvalues`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "Jordan form basis" only appears inside the solution, not the prompt or hint
    await expect(article.getByText(/Jordan form basis/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/Jordan form basis/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
