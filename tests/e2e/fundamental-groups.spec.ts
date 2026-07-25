import { test, expect } from '@playwright/test';

const BASE = '/part-16-algebraic-topology-i-homotopy/02-fundamental-groups';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Fundamental groups — KaTeX renders', () => {
  test('defining-π₁ slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-fundamental-groups/02-defining-pi1`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Fundamental groups — MCQ flow (associativity time-split)', () => {
  const SLIDE = `${BASE}/01-fusing-paths/03-associativity-is-a-lie`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#fg64-fuse-mcq-assoc-times`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page
      .getByRole('button', { name: '[0, 1/2], [1/2, 3/4], [3/4, 1]', exact: true })
      .click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page
      .getByRole('button', { name: '[0, 1/4], [1/4, 1/2], [1/2, 1]', exact: true })
      .click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Fundamental groups — NumericInput flow (figure-eight generators)', () => {
  const SLIDE = `${BASE}/02-fundamental-groups/06-the-figure-eight`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#fg64-fg-num-figure-eight-generators`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
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
test.describe('Fundamental groups — ProofReveal flow (α∗ᾱ ≃ do-nothing loop)', () => {
  const SLIDE = `${BASE}/02-fundamental-groups/03-the-reverse-path`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#fg64-fg-proof-alpha-abar`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/retracing those same steps back/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/retracing those same steps back/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/retracing those same steps back/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Fundamental groups — Problem flow (hanging a picture with two nails)', () => {
  const SLIDE = `${BASE}/07-problems/04-hanging-a-picture`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#fg64-prob-hanging-picture`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "reduced word in the free group" appears only inside the solution text
    await expect(article.getByText(/reduced word in the free group/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/reduced word in the free group/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
