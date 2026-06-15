import { test, expect } from '@playwright/test';

const BASE = '/part-6-representation-theory/02-semisimple-algebras';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Semisimple algebras — KaTeX renders', () => {
  test('sum-of-squares slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-semisimple-algebras/03-sum-of-squares`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Semisimple algebras — MCQ flow (identify semisimple algebra)', () => {
  const SLIDE = `${BASE}/03-semisimple-algebras/04-semisimple-check`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#ssa-semisimple-mcq-identify`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // ℂ × ℂ is the correct semisimple algebra
    await page.getByRole('button', { name: /ℂ × ℂ — the product of two copies of ℂ/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // dual numbers are not semisimple — clicking them is wrong
    await page.getByRole('button', { name: /ℂ\[x\] \/ \(x²\) — the algebra of dual numbers/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Semisimple algebras — NumericInput flow (dimension of refl₀)', () => {
  const SLIDE = `${BASE}/05-representations-of-s3/04-decomposition-check`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#ssa-s3-num-dim-reflection`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
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
test.describe('Semisimple algebras — ProofReveal flow (Maschke P(w) = w)', () => {
  const SLIDE = `${BASE}/04-maschkes-theorem/03-verify-averaging`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#ssa-maschke-proof-P-fixes-W`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Averaging \|G\| equal terms w/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Averaging \|G\| equal terms w/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Averaging \|G\| equal terms w/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Semisimple algebras — Problem flow (irreps of finite group are finite-dim)', () => {
  const SLIDE = `${BASE}/06-problems/01-standard`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#ssa-prob-irreps-finite-dim`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "spanned by at most |G| vectors" only appears inside the solution text
    await expect(article.getByText(/spanned by at most/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).nth(2).click();
    await expect(article.getByText(/spanned by at most/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
