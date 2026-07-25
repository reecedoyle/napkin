import { test, expect } from '@playwright/test';

const BASE = '/part-14-algebraic-nt-i-rings-of-integers/01-algebraic-integers';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Algebraic integers — KaTeX renders', () => {
  test('minimal polynomial slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-motivation-from-high-school-algebra/02-minimal-polynomial`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Algebraic integers — MCQ flow (degree of primitive 5th root of unity)', () => {
  const SLIDE = `${BASE}/01-motivation-from-high-school-algebra/04-cube-root-conjugates`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#an53-mot-mcq-degree-zeta5`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // degree 4 is correct for ζ₅
    await page.getByRole('button', { name: /^4$/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // degree 5 is wrong
    await page.getByRole('button', { name: /^5$/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Algebraic integers — NumericInput flow (degree of √2 + √3)', () => {
  const SLIDE = `${BASE}/02-algebraic-numbers-and-integers/03-gauss-lemma-shortcut`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#an53-ai-num-degree-sqrt2-sqrt3`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('2');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('4');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('4');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Algebraic integers — ProofReveal flow (√3 and √5 in ℚ(√3+√5))', () => {
  const SLIDE = `${BASE}/04-primitive-element-theorem/02-prototype-sqrt3-sqrt5`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#an53-pet-proof-sqrt3-sqrt5`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Let γ = √3 \+ √5/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Let γ = √3 \+ √5/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Let γ = √3 \+ √5/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Algebraic integers — Problem flow (Kronecker\'s theorem)', () => {
  const SLIDE = `${BASE}/05-problems/03-kronecker-and-noetherian`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#an53-prob-kronecker`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "Tracing the Galois action" only appears inside the solution text. (The
    // hint also says "Pigeonhole", so anchor on a truly solution-only phrase.)
    await expect(article.getByText(/Tracing the Galois action/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/Tracing the Galois action/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
