import { test, expect } from '@playwright/test';

const BASE = '/part-10-measure-theory/02-constructing-the-borel-and-lebesgue-measure';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Constructing the Borel and Lebesgue measure — KaTeX renders', () => {
  test('outer-measure definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-outer-measures/01-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Constructing the Borel and Lebesgue measure — MCQ flow (algebra vs σ-algebra)', () => {
  const SLIDE = `${BASE}/01-pre-measures/03-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#clb-s1-mcq-algebra-vs-sigma`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: 'Neither — a σ-algebra requires countably infinite closure, but an algebra only requires finite', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: 'Closure under countably infinite union', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Constructing the Borel and Lebesgue measure — NumericInput flow (pipeline steps)', () => {
  const SLIDE = `${BASE}/03-caratheodory-extension/04-the-three-step-table`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#clb-s3-num-steps`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('2');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('3');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Constructing the Borel and Lebesgue measure — ProofReveal flow (compatibility)', () => {
  const SLIDE = `${BASE}/02-outer-measures/03-proof-sketch`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#clb-s2-proof-compatibility`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/pre-measure axiom gives/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/pre-measure axiom gives/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/pre-measure axiom gives/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Constructing the Borel and Lebesgue measure — Problem flow (insane scientist)', () => {
  const SLIDE = `${BASE}/07-problems/01-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#clb-prob-insane-scientist`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "rectangles are NOT μ*-measurable" only appears inside the solution text
    await expect(article.getByText(/rectangles are NOT/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).nth(1).click();
    await expect(article.getByText(/rectangles are NOT/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
