import { test, expect } from '@playwright/test';

const BASE = '/part-7-quantum-algorithms/02-quantum-circuits';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Quantum circuits — KaTeX renders', () => {
  test('Toffoli gate slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-reversible-classical-logic/04-toffoli-gate`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Quantum circuits — MCQ flow (universality)', () => {
  const SLIDE = `${BASE}/01-classical-logic-gates/02-universality`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#qcirc-clg-mcq-universal`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // OR and NOT are sufficient — correct answer is "c"
    await page.getByRole('button', { name: /OR and NOT/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // NOT alone is wrong
    await page.getByRole('button', { name: /NOT alone/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Quantum circuits — ProofReveal flow (Toffoli simulates NOT)', () => {
  const SLIDE = `${BASE}/02-reversible-classical-logic/04-toffoli-gate`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#qcirc-rev-proof-toffoli-not`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/correct configuration for NOT/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/correct configuration for NOT/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/correct configuration for NOT/i)).toBeVisible();
  });
});

// ── MCQ flow (Deutsch-Jozsa) ──────────────────────────────────────────────────
test.describe('Quantum circuits — MCQ flow (Deutsch-Jozsa measurement)', () => {
  const SLIDE = `${BASE}/04-deutsch-jozsa-algorithm/04-measurement-and-conclusion`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#qcirc-dj-mcq-measurement`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Measuring |0⟩ means f is constant — correct answer is "b"
    await page.getByRole('button', { name: /f is constant/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Quantum circuits — Problem flow (baby no-cloning)', () => {
  const SLIDE = `${BASE}/05-problems/01-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#qcirc-prob-no-clone`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "These two states are different" only appears inside the no-cloning solution text
    await expect(article.getByText(/These two states are different/i)).toBeHidden();

    // Click the second "Show solution" button (no-cloning is the second problem)
    const showSolutionBtns = page.getByRole('button', { name: /show solution/i });
    await showSolutionBtns.nth(1).click();
    await expect(article.getByText(/These two states are different/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
