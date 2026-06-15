import { test, expect } from '@playwright/test';

const BASE = '/part-5-more-on-groups/03-pid-structure';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('PID structure theorem — KaTeX renders', () => {
  test('invariant form slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-structure-theorem/01-invariant-form`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('PID structure theorem — MCQ flow (rank of ℤ ⊕ ℤ/4ℤ ⊕ ℤ/9ℤ)', () => {
  const SLIDE = `${BASE}/01-fg-abelian-groups/03-rank-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#pid-fg-mcq-rank`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // rank is 1 — one free ℤ summand
    await page.getByRole('button', { name: /^1$/ }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // rank 3 is wrong
    await page.getByRole('button', { name: /^3$/ }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('PID structure theorem — NumericInput flow (minimum generators of ℤ/3ℤ ⊕ ℤ/5ℤ)', () => {
  const SLIDE = `${BASE}/01-fg-abelian-groups/02-classification-theorem`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#pid-fg-num-z3z5-generators`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
    await input.fill('2');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('1');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('1');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('PID structure theorem — ProofReveal flow (Noetherian direct sum)', () => {
  const SLIDE = `${BASE}/04-free-module-reduction/02-noetherian-direct-sum`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#pid-free-proof-rdn-noetherian`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/is handled by the generators/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/is handled by the generators/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/is handled by the generators/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('PID structure theorem — Problem flow (vector spaces are isomorphic)', () => {
  const SLIDE = `${BASE}/07-problems/01-daggered`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#pid-prob-vector-spaces-iso`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "contributing a free summand" only appears inside the solution text
    await expect(article.getByText(/contributing a free summand/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/contributing a free summand/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
