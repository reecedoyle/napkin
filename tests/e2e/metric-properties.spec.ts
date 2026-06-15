import { test, expect } from '@playwright/test';

const BASE = '/part-3-basic-topology/01-metric-properties';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Metric properties — KaTeX renders', () => {
  test('Cauchy sequences slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-completeness/01-cauchy-sequences`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Metric properties — MCQ flow (discrete metric is bounded)', () => {
  const SLIDE = `${BASE}/01-boundedness/03-examples`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#mtp-bnd-mcq-discrete`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // "Yes — all pairwise distances are at most 1" is the correct answer
    await page.getByRole('button', { name: /Yes — all pairwise distances are at most 1, so D = 1 works/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // ℕ is infinite so diameter must be infinite — wrong
    await page.getByRole('button', { name: /No — ℕ is infinite so the diameter must be infinite/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow — none in this chapter; use second MCQ instead ──────────
test.describe('Metric properties — MCQ flow (clopen sets)', () => {
  const SLIDE = `${BASE}/04-subspaces/04-clopen-sets`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#mtp-sub-mcq-clopen`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // "Yes — every point of (2,3) has a small ε-ball (within M) entirely inside (2,3)"
    await page.getByRole('button', { name: /Yes — every point of \(2,3\) has a small ε-ball/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Metric properties — ProofReveal flow (complete iff closed)', () => {
  const SLIDE = `${BASE}/04-subspaces/03-complete-iff-closed`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#mtp-sub-proof-complete-closed`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/limits are unique/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/limits are unique/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/limits are unique/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Metric properties — Problem flow (Banach fixed point)', () => {
  const SLIDE = `${BASE}/05-problems/01-banach-and-two-metrics`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#mtp-prob-banach-fixed-point`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "diagonal argument" only appears inside the solution, not the prompt/hint
    await expect(article.getByText(/uniqueness.*contradiction/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/uniqueness.*contradiction/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
