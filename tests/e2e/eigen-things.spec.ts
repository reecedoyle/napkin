import { test, expect } from '@playwright/test';

const BASE = '/part-4-linear-algebra/02-eigen-things';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Eigen-things — KaTeX renders', () => {
  test('Jordan form theorem slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/04-the-jordan-form/02-jordan-canonical-form-theorem`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Eigen-things — MCQ flow (which is an eigenvector)', () => {
  const SLIDE = `${BASE}/03-eigenvectors-and-eigenvalues/01-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#eig-def-mcq-which-is-eigenvector`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // e₁ is the 2-eigenvector — correct answer is "c"
    await page.getByRole('button', { name: /e₁\s+\(the vector \(1,0\)\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // e₂ is NOT an eigenvector — clicking it is wrong
    await page.getByRole('button', { name: /e₂\s+\(the vector \(0,1\)\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Eigen-things — NumericInput flow (algebraic multiplicity sum)', () => {
  const SLIDE = `${BASE}/08-algebraic-and-geometric-multiplicity/03-example-and-trace-det`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#eig-mult-num-alg-mult-sum`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
    await input.fill('1000');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('2018');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('2018');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Eigen-things — ProofReveal flow (eigenspace is a subspace)', () => {
  const SLIDE = `${BASE}/03-eigenvectors-and-eigenvalues/02-eigenspace`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#eig-eigenspace-proof-subspace`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/three subspace conditions/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/three subspace conditions/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/three subspace conditions/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Eigen-things — Problem flow (differentiation of polynomials)', () => {
  const SLIDE = `${BASE}/09-problems/03-differentiation-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#eig-prob-diff-poly`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "nonzero constants" only appears inside the solution, not the prompt/hint
    await expect(article.getByText(/nonzero constants/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/nonzero constants/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
