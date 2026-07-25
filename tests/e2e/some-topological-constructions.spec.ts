import { test, expect } from '@playwright/test';

const BASE = '/part-16-algebraic-topology-i-homotopy/01-some-topological-constructions';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Some topological constructions — KaTeX renders', () => {
  test('spheres-and-balls slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-spheres/01-spheres-and-balls`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Some topological constructions — MCQ flow (sphere CW cell count)', () => {
  const SLIDE = `${BASE}/05-cw-complexes/03-spheres-as-cw-complexes`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#tc63-cw-mcq-sphere-min-cells`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // The minimal CW structure on S^n uses 2 cells — correct answer is "b"
    await page.getByRole('button', { name: '2', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: '1', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Some topological constructions — ProofReveal flow (open ball ≅ ℝⁿ)', () => {
  const SLIDE = `${BASE}/01-spheres/02-open-ball-exercise`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#tc63-sph-proof-open-ball-rn`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/radial stretching map/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/radial stretching map/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/radial stretching map/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Some topological constructions — Problem flow (finite CW complex is compact)', () => {
  const SLIDE = `${BASE}/07-problems/03-finite-cw-complex-is-compact`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#tc63-prob-finite-cw-compact`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "Induct on the dimension" only appears inside the solution, not the prompt/hint
    await expect(article.getByText(/Induct on the dimension/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/Induct on the dimension/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
