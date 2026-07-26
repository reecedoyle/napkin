import { test, expect } from '@playwright/test';

const BASE = '/part-17-category-theory/03-limits-in-categories-to-do';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Limits in categories — KaTeX renders', () => {
  test('universal-property slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-equalizers/03-universal-property`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Limits in categories — MCQ flow (kernel as equalizer)', () => {
  const SLIDE = `${BASE}/01-equalizers/06-kernels-as-equalizers`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#lim68-eq-mcq-kernel-equalizer`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: 'The trivial homomorphism G → H', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: 'The identity map G → G', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Limits in categories — ProofReveal flow (equalizer uniqueness)', () => {
  const SLIDE = `${BASE}/01-equalizers/04-uniqueness-up-to-isomorphism`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#lim68-eq-proof-uniqueness`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "mutually inverse" only appears inside the revealed solution.
    await expect(article.getByText(/mutually inverse/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/mutually inverse/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/mutually inverse/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Limits in categories — Problem flow (equalizers are monic)', () => {
  const SLIDE = `${BASE}/04-problems/01-equalizers-are-monic`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#lim68-prob-equalizers-monic`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "apex Z" only appears inside the solution, not the prompt or intro prose.
    await expect(article.getByText(/apex Z/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/apex Z/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
