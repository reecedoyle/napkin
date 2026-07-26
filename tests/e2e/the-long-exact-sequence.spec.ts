import { test, expect } from '@playwright/test';

const BASE = '/part-18-algebraic-topology-ii-homology/02-the-long-exact-sequence';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('The long exact sequence — KaTeX renders', () => {
  test('exactness slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-short-exact-sequences/01-exactness-and-short-exact-sequences`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('The long exact sequence — MCQ flow (exact chain complex)', () => {
  const SLIDE = `${BASE}/01-short-exact-sequences/01-exactness-and-short-exact-sequences`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#tle71-s1-mcq-exact-complex`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: 'Exact', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: 'Split', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('The long exact sequence — NumericInput flow (sphere homology check)', () => {
  const SLIDE = `${BASE}/03-mayer-vietoris/06-quick-check-sphere-homology`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#tle71-s3-num-sphere-check`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('5');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('5');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('The long exact sequence — ProofReveal flow (connecting map lands on a cycle)', () => {
  const SLIDE = `${BASE}/02-long-exact-sequence-of-homology/04-checking-the-connecting-map-lands-on-a-cycle`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#tle71-s2-proof-a-is-a-cycle`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "meaning a really is a cycle" only appears in the hidden solution.
    await expect(article.getByText(/meaning a really is a cycle/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/meaning a really is a cycle/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/meaning a really is a cycle/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('The long exact sequence — Problem flow (sphere homology induction)', () => {
  const SLIDE = `${BASE}/04-problems/01-sphere-homology-induction`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#tle71-prob-sphere-induction`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "S^0 is two points" only appears inside the base-case solution text.
    await expect(article.getByText(/S\^0 is two points/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/S\^0 is two points/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
