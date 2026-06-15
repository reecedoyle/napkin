import { test, expect } from '@playwright/test';

const BASE = '/part-4-linear-algebra/07-transpose-and-adjoint';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Transpose and adjoint — KaTeX renders', () => {
  test('dual map definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-dual-of-a-map/01-the-dual-map`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Transpose and adjoint — MCQ flow (domain of T∨)', () => {
  const SLIDE = `${BASE}/01-dual-of-a-map/04-basis-free`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#trn-dual-mcq-direction`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // W∨ is the correct domain
    await page.getByRole('button', { name: /W∨ \(the dual of W\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // V∨ is wrong
    await page.getByRole('button', { name: /V∨ \(the dual of V\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Transpose and adjoint — NumericInput flow (rank of M)', () => {
  const SLIDE = `${BASE}/02-cautionary-tale/03-counterexample`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#trn-ct-num-rank-m`;

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
test.describe('Transpose and adjoint — ProofReveal flow (transpose theorem)', () => {
  const SLIDE = `${BASE}/01-dual-of-a-map/03-transpose-theorem`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#trn-dual-proof-transpose`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/coefficient of e_j/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/coefficient of e_j/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/coefficient of e_j/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Transpose and adjoint — Problem flow (double dual)', () => {
  const SLIDE = `${BASE}/06-problems/01-double-dual-and-fundamental`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#trn-prob-double-dual`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "canonical" only appears inside the solution, not the prompt/hint
    await expect(article.getByText(/evaluation pairing/i).first()).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/evaluation pairing/i).first()).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
