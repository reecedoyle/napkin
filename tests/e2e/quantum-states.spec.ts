import { test, expect } from '@playwright/test';

const BASE = '/part-7-quantum-algorithms/01-quantum-states';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Quantum states — KaTeX renders', () => {
  test('born-rule slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-observations/02-born-rule`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow — bra of ket ─────────────────────────────────────────────────────
test.describe('Quantum states — MCQ flow (bra of a ket)', () => {
  const SLIDE = `${BASE}/01-bra-ket-notation/03-finite-dimensional-hilbert-spaces`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#qs-bk-mcq-bra-of-ket`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Option c is correct — conjugate transpose of the column
    await page.getByRole('button', { name: /conjugate transpose of the column/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // Option a is wrong — it's the same row vector, not conjugated
    await page.getByRole('button', { name: /the same row vector/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow — normalisation ─────────────────────────────────────────
test.describe('Quantum states — NumericInput flow (normalisation check)', () => {
  const SLIDE = `${BASE}/02-the-state-space/02-normalisation`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#qs-ss-num-normalise`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('2');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('1');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('1');
  });
});

// ── ProofReveal flow — repeat measurement ─────────────────────────────────────
test.describe('Quantum states — ProofReveal flow (repeat measurement)', () => {
  const SLIDE = `${BASE}/03-observations/06-distinguishing-states`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#qs-obs-proof-repeat-measure`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/collapsed state is itself an eigenstate/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/collapsed state is itself an eigenstate/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/collapsed state is itself an eigenstate/i)).toBeVisible();
  });
});

// ── Problem flow — singlet x-measurement ─────────────────────────────────────
test.describe('Quantum states — Problem flow (singlet x-measurement)', () => {
  const SLIDE = `${BASE}/05-problems/01-singlet-x-measurement`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#qs-prob-singlet-x`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "Reading off the coefficients" only appears inside the solution text
    // ("spooky correlation" also appears in the visible intro prose).
    await expect(article.getByText(/Reading off the coefficients/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/Reading off the coefficients/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
