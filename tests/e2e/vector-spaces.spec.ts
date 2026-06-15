import { test, expect } from '@playwright/test';

const BASE = '/part-4-linear-algebra/01-vector-spaces';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Vector spaces — KaTeX renders', () => {
  test('dimension theorem slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/04-linear-independence-and-bases/03-dimension-theorem`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Vector spaces — MCQ flow (which is a field)', () => {
  const SLIDE = `${BASE}/01-rings-and-fields/01-rings-and-fields-review`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#vs-rings-mcq-which-field`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // ℚ is the correct answer (a field)
    await page.getByRole('button', { name: /ℚ \(rationals under \+ and ·\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // ℤ is NOT a field — clicking it is wrong for the "which is a field" question
    await page.getByRole('button', { name: /ℤ \(integers under \+ and ·\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Vector spaces — NumericInput flow (dimension of plane in ℝ³)', () => {
  const SLIDE = `${BASE}/04-linear-independence-and-bases/04-coordinates`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#vs-basis-num-dim-plane`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
    await input.fill('3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('2');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('2');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Vector spaces — ProofReveal flow (rank-nullity)', () => {
  const SLIDE = `${BASE}/07-subspaces/03-rank-nullity`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#vs-sub-proof-rank-nullity`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/we get adapted bases/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/we get adapted bases/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/we get adapted bases/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Vector spaces — Problem flow (idempotent decomposition)', () => {
  const SLIDE = `${BASE}/10-problems/02-starred-and-more`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#vs-prob-idempotent`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "ker P ∩ im P" only appears inside the idempotent solution text
    await expect(article.getByText(/we check two things/i)).toBeHidden();

    // 3rd <Problem> on the slide is the idempotent one — lattice
     // points and Putnam are above it, T^N stabilisation below.
    await page.getByRole('button', { name: /show solution/i }).nth(2).click();
    await expect(article.getByText(/we check two things/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
