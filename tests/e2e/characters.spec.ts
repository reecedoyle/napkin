import { test, expect } from '@playwright/test';

const BASE = '/part-6-representation-theory/03-characters';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Characters — KaTeX renders', () => {
  test('orthogonality proof slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-orthogonality/06-orthogonality-proof`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Characters — MCQ flow (dimension readout)', () => {
  const SLIDE = `${BASE}/01-definitions/03-four-mysteries`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#chr-def-mcq-dimension`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // "dim V" is the correct answer (option c)
    await page.getByRole('button', { name: /dim V/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // Clicking option "a" (value 1) is wrong
    await page.getByRole('button', { name: /^1$/ }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Characters — NumericInput flow (norm of trivial character)', () => {
  const SLIDE = `${BASE}/03-orthogonality/07-irreducibility-check`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#chr-orth-num-norm-s3triv`;

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
test.describe('Characters — ProofReveal flow (character theorem part b)', () => {
  const SLIDE = `${BASE}/02-dual-space-commutator/04-character-theorem`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#chr-comm-proof-part-b`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/By semisimplicity/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/By semisimplicity/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/By semisimplicity/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Characters — Problem flow (decomposition theorem)', () => {
  const SLIDE = `${BASE}/05-problems/01-standard-and-daggered`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#chr-prob-decomposition`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "By orthonormality of irreducible characters" only appears inside the solution
    await expect(article.getByText(/By orthonormality of irreducible characters/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/By orthonormality of irreducible characters/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
