import { test, expect } from '@playwright/test';

const BASE = '/part-7-quantum-algorithms/03-shors-algorithm';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe("Shor's algorithm — KaTeX renders", () => {
  test('QFT definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-quantum-fourier-transform/02-qft-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe("Shor's algorithm — MCQ flow (FFT cost)", () => {
  const SLIDE = `${BASE}/01-classical-fourier-transform/07-complexity-bottleneck`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#shor-dft-mcq-fft-cost`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Correct answer: O(2ⁿ · n) — still exponential in n
    await page.getByRole('button', { name: /O\(2ⁿ · n\) — still exponential in n/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // O(n²) is wrong — that's the QFT, not the FFT
    await page.getByRole('button', { name: /O\(n²\) — polynomial in n/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe("Shor's algorithm — NumericInput flow (gate count for n=10)", () => {
  const SLIDE = `${BASE}/02-quantum-fourier-transform/07-why-quantum-wins`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#shor-qft-num-gates-n10`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('45');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('55');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('55');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe("Shor's algorithm — ProofReveal flow (QFT circuit n=3)", () => {
  const SLIDE = `${BASE}/02-quantum-fourier-transform/05-circuit-n3`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#shor-qft-proof-n3-output`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Start with/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Start with/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Start with/i)).toBeVisible();
  });
});
