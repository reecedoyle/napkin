import { test, expect } from '@playwright/test';

const BASE = '/part-11-probability/02-large-number-laws-to-do';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Large number laws — KaTeX renders', () => {
  test('SLLN statement slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-strong-law-of-large-numbers/03-slln-statement`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Large number laws — MCQ flow (archer example)', () => {
  const SLIDE = `${BASE}/01-notions-of-convergence/02-non-example-archer`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#ll-conv-mcq-archer`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // The correct answer is b — almost no world converges to a bulls-eye
    await page.getByRole('button', { name: /almost no world converges to a bulls-eye/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // "1 (almost every world...)" is wrong
    await page.getByRole('button', { name: /almost every world converges to a bulls-eye/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Large number laws — NumericInput flow (biased random walk)', () => {
  const SLIDE = `${BASE}/03-strong-law-of-large-numbers/01-biased-random-walk`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#ll-slln-num-walk-answer`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
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
test.describe('Large number laws — ProofReveal flow (Weierstrass via Bernstein)', () => {
  const SLIDE = `${BASE}/02-weak-law-of-large-numbers/03-weierstrass-proof`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#ll-wlln-proof-bernstein`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/uniform continuity/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/uniform continuity/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/uniform continuity/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Large number laws — Problem flow (quantifier hell)', () => {
  const SLIDE = `${BASE}/04-problems/01-quantifier-hell`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#ll-prob-quantifier-hell`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // This phrase is unique to the solution — it is absent from the prompt and
    // the hint (both of which also mention the "anomaly set"), so it stays a
    // single-element match after the hint+solution are both revealed.
    await expect(article.getByText(/converges almost surely to X/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/converges almost surely to X/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
