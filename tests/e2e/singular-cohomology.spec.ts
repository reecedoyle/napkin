import { test, expect } from '@playwright/test';

const BASE = '/part-18-algebraic-topology-ii-homology/05-singular-cohomology';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Singular cohomology — KaTeX renders', () => {
  test('cochain-complexes slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-cochain-complexes/02-cochain-complexes`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Singular cohomology — MCQ flow (H⁰ of 5 components)', () => {
  const SLIDE = `${BASE}/02-cohomology-of-spaces/04-check-your-understanding`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#sc74-cohom-spaces-mcq-h0-five-components`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: 'ℤ⁵ (five copies of ℤ)', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: 'ℤ/5ℤ', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Singular cohomology — NumericInput flow (|Ext(ℤ^⊕2015, G)|)', () => {
  const SLIDE = `${BASE}/04-universal-coefficient-theorem/05-ext-practice`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#sc74-uct-num-ext-z2015`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
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
test.describe('Singular cohomology — ProofReveal flow (Ext(ℤ/nℤ, G) = G/nG)', () => {
  const SLIDE = `${BASE}/04-universal-coefficient-theorem/04-computing-ext`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#sc74-uct-proof-ext-cn-g`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/determined by where 1 goes/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/determined by where 1 goes/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/determined by where 1 goes/i)).toBeVisible();
  });
});
