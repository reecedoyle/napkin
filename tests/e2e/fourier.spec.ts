import { test, expect } from '@playwright/test';

const BASE = '/part-4-linear-algebra/06-fourier';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Fourier — KaTeX renders', () => {
  test('Parseval theorem slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/05-parseval/01-parseval-theorem`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Fourier — MCQ flow (physical variable)', () => {
  const SLIDE = `${BASE}/01-synopsis/04-synopsis-mcq`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#four-synopsis-mcq-roles`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // x ∈ Z is the physical variable — correct answer is "b"
    await page.getByRole('button', { name: /x ∈ Z \(the input to f\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // ξ is the frequency variable, not the physical variable — clicking it is wrong
    await page.getByRole('button', { name: /ξ \(the frequency variable\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Fourier — NumericInput flow (average value f̂(∅))', () => {
  const SLIDE = `${BASE}/03-common-examples/03-binary-example`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#four-ex-binary-num-avg`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
    await input.fill('0.5');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('0.25');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('0.25');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Fourier — ProofReveal flow (orthonormal basis facts)', () => {
  const SLIDE = `${BASE}/02-hilbert-spaces/02-orthonormal-basis-facts`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#four-hilbert-proof-onb-facts`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/standard expansion formula/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/standard expansion formula/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/standard expansion formula/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Fourier — Problem flow (Basel extension)', () => {
  const SLIDE = `${BASE}/08-problems/01-standard-problem`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#four-prob-sum-n4`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "integration by parts twice" only appears inside the solution text
    await expect(article.getByText(/integration by parts twice/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/integration by parts twice/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
