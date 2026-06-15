import { test, expect } from '@playwright/test';

const BASE = '/part-2-basic-abstract-algebra/01-quotient-groups';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Quotient groups — KaTeX renders', () => {
  test('kernel slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-homomorphisms/04-kernel`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Quotient groups — MCQ flow (kernel of mod-6 map)', () => {
  const SLIDE = `${BASE}/02-homomorphisms/06-homomorphism-mcq`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#quot-hom-mcq-kernel`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // 6ℤ is the correct kernel
    await page.getByRole('button', { name: /6ℤ/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // {0} is the kernel of an injective map — wrong here
    await page.getByRole('button', { name: /\{0\}/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Quotient groups — NumericInput flow (cosets of 3ℤ)', () => {
  const SLIDE = `${BASE}/03-cosets-and-modding-out/06-coset-exercise`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#quot-cos-num-cosets`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('5');
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
test.describe('Quotient groups — ProofReveal flow (x ∼ y iff xy⁻¹ ∈ N)', () => {
  const SLIDE = `${BASE}/03-cosets-and-modding-out/08-cosets-proofreveal`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#quot-cos-proof-equiv`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Suppose φ\(x\)/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Suppose φ\(x\)/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Suppose φ\(x\)/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Quotient groups — Problem flow (g² homomorphism)', () => {
  const SLIDE = `${BASE}/07-problems/01-standard-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#quot-prob-g-squared-hom`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "abelian" only appears in the solution text, not the prompt/hint
    await expect(article.getByText(/abelian/i).first()).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/abelian/i).first()).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
