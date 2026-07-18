import { test, expect } from '@playwright/test';

const BASE = '/part-14-algebraic-nt-i-rings-of-integers/04-minkowski-bound-and-class-groups';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Minkowski bound and class groups — KaTeX renders', () => {
  test('discriminant definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-the-discriminant/03-discriminant-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Minkowski bound and class groups — MCQ flow (trivial class group)', () => {
  const SLIDE = `${BASE}/01-the-class-group/02-class-group-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#an56-cls-mcq-pid`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Correct: "When every nonzero ideal of 𝒪_K is principal"
    await page.getByRole('button', { name: /every nonzero ideal/i }).click();
    await expect(page.getByText(/trivial exactly when/i).first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText(/trivial exactly when/i).first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /UFD but not a PID/i }).click();
    await expect(page.getByText(/trivial exactly when/i).first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Minkowski bound and class groups — NumericInput flow (discriminant of ℚ(√−3))', () => {
  const SLIDE = `${BASE}/02-the-discriminant/04-discriminant-examples`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#an56-disc-num-qi`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('4');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('-3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('-3');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Minkowski bound and class groups — ProofReveal flow (Minkowski pigeonhole)', () => {
  const SLIDE = `${BASE}/04-minkowskis-theorem/02-proof-sketch`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#an56-mink-proof-pigeonhole`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Pigeonhole Principle two distinct points/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Pigeonhole Principle two distinct points/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Pigeonhole Principle two distinct points/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Minkowski bound and class groups — Problem flow (ℚ(√−163) has class number 1)', () => {
  const SLIDE = `${BASE}/10-problems/01-class-group-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#an56-prob-qq-sqrt-minus163`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "complete list of n" only appears inside the solution text, not the prompt/hint
    await expect(article.getByText(/complete list of n/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/complete list of n/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
