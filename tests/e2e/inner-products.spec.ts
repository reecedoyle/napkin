import { test, expect } from '@playwright/test';

const BASE = '/part-4-linear-algebra/05-inner-products';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Inner products — KaTeX renders', () => {
  test('Cauchy-Schwarz slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-norms/02-cauchy-schwarz`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Inner products — MCQ flow (which pair is orthogonal)', () => {
  const SLIDE = `${BASE}/03-orthogonality/01-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#inp-orth-mcq-orthogonal-check`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // (1,0) and (0,1) are orthogonal — correct answer is "b"
    await page.getByRole('button', { name: /\(1, 0\) and \(0, 1\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // (1,1) and (1,2) are NOT orthogonal — clicking is wrong
    await page.getByRole('button', { name: /\(1, 1\) and \(1, 2\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Inner products — NumericInput flow (norm of (3,4,0))', () => {
  const SLIDE = `${BASE}/02-norms/01-the-norm`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#inp-norms-num-length-r3`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
    await input.fill('3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('5');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('5');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Inner products — ProofReveal flow (Cauchy-Schwarz)', () => {
  const SLIDE = `${BASE}/02-norms/02-cauchy-schwarz`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#inp-norms-proof-cauchy-schwarz`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/The inequality is immediate when/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/The inequality is immediate when/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/The inequality is immediate when/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Inner products — Problem flow (Pythagorean theorem)', () => {
  const SLIDE = `${BASE}/05-problems/01-standard`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#inp-prob-pythagorean`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "The cross terms vanish" only appears inside the solution text
    await expect(article.getByText(/The cross terms vanish/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/The cross terms vanish/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
