import { test, expect } from '@playwright/test';

const BASE = '/part-13-riemann-surfaces/05-the-riemann-roch-theorem';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Riemann-Roch — KaTeX renders', () => {
  test('theorem slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/05-the-riemann-roch-theorem/03-the-theorem`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Riemann-Roch — MCQ flow (order of a meromorphic function)', () => {
  const SLIDE = `${BASE}/01-motivation/02-order-of-a-meromorphic-function`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#rs51-mot-mcq-ord`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // ord_i(f) = −2 — correct answer is "b"
    await page.getByRole('button', { name: /−2 \(pole of order 2 at i\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // Choosing "+2" is wrong
    await page.getByRole('button', { name: /\+2 \(zero of multiplicity 2 at i\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Riemann-Roch — NumericInput flow (dim L(7·∞))', () => {
  const SLIDE = `${BASE}/05-the-riemann-roch-theorem/04-on-the-sphere`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#rs51-rr-num-sphere`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('7');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('8');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('8');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Riemann-Roch — ProofReveal flow (why L(0) ≅ ℂ)', () => {
  const SLIDE = `${BASE}/04-the-principal-divisor/04-properties-of-L-D`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#rs51-pd-proof-L0`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/meromorphic function on a compact Riemann surface/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/meromorphic function on a compact Riemann surface/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/meromorphic function on a compact Riemann surface/i)).toBeVisible();
  });
});
