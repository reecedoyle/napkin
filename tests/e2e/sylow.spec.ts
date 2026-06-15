import { test, expect } from '@playwright/test';

const BASE = '/part-5-more-on-groups/02-sylow';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Sylow — KaTeX renders', () => {
  test('three-theorems slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-sylow-theorems/03-the-three-theorems`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Sylow — MCQ flow (consequences, how many Sylow 7-subgroups)', () => {
  const SLIDE = `${BASE}/01-sylow-theorems/04-consequences`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#syl-cons-mcq-normal-sylow`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Exactly 1 Sylow 7-subgroup is the correct answer
    await page.getByRole('button', { name: /Exactly 1/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // "Exactly 7" is wrong
    await page.getByRole('button', { name: /Exactly 7/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Sylow — NumericInput flow (n₅ for |G|=30)', () => {
  const SLIDE = `${BASE}/01-sylow-theorems/05-triple-prime-product`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#syl-tpp-num-nr-for-30`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
    await input.fill('1');
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
test.describe('Sylow — ProofReveal flow (nₚ ≡ 1 mod p)', () => {
  const SLIDE = `${BASE}/02-proving-sylow/05-counting-steps`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#syl-proof-np-mod-p`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Exactly one fixed point/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Exactly one fixed point/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Exactly one fixed point/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Sylow — Problem flow (|G| ≠ 56)', () => {
  const SLIDE = `${BASE}/04-problems/01-cauchy-and-order-56`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#syl-prob-order-56`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "contradicting simplicity" appears only inside the solution text
    await expect(article.getByText(/contradicting simplicity/i)).toBeHidden();

    // The order-56 Problem is the 2nd on this slide (Cauchy's theorem is 1st).
    await page.getByRole('button', { name: /show solution/i }).nth(1).click();
    await expect(article.getByText(/contradicting simplicity/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
