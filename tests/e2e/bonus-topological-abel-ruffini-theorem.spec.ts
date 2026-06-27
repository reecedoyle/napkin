import { test, expect } from '@playwright/test';

const BASE = '/part-9-complex-analysis/04-bonus-topological-abel-ruffini-theorem';

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Abel-Ruffini — KaTeX renders', () => {
  test('nested-roots commutator slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-step-2-nested-roots/03-commutators-cancel-phase`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Abel-Ruffini — MCQ flow (why continuity implies root permutation)', () => {
  const SLIDE = `${BASE}/01-the-game-plan/02-the-formula-must-track-roots`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#ar-gp-mcq-continuity`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.goto(SLIDE);
    // correct answer is "b"
    await page.getByRole('button', { name: /Because F is continuous, so moving the inputs continuously forces the output to move continuously too/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.goto(SLIDE);
    // wrong answer is "a"
    await page.getByRole('button', { name: /Because F is a polynomial in the coefficients/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Abel-Ruffini — NumericInput flow (order of 3-cycle)', () => {
  const SLIDE = `${BASE}/03-step-2-nested-roots/04-computing-the-commutator`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#ar-s2-num-commutator-order`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
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
test.describe('Abel-Ruffini — ProofReveal flow (rational formula contradiction)', () => {
  const SLIDE = `${BASE}/02-step-1-the-simplest-case/04-what-the-symmetry-group-sees`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#ar-s1-proof-rational-fail`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/deterministic function of its inputs/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/deterministic function of its inputs/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/deterministic function of its inputs/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Abel-Ruffini — Problem flow (A₅ is not solvable)', () => {
  const SLIDE = `${BASE}/06-problems/01-a5-not-solvable`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#ar-prob-a5-not-solvable`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "only 1 and 60 divide 60" only appears inside the solution text, not the hint or prose
    await expect(article.getByText(/only 1 and 60 divide 60/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/only 1 and 60 divide 60/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
