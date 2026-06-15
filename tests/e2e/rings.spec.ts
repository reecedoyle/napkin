import { test, expect } from '@playwright/test';

const BASE = '/part-2-basic-abstract-algebra/02-rings';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Rings and ideals — KaTeX renders', () => {
  test('ring definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-definition/01-ring-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Rings and ideals — MCQ flow (ring axioms)', () => {
  const SLIDE = `${BASE}/02-definition/01-ring-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#rng-def-mcq-axioms`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // "every nonzero element has a multiplicative inverse" is NOT a ring axiom — correct = "c"
    await page.getByRole('button', { name: /every nonzero element has a multiplicative inverse/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // "(R, +) is an abelian group" IS a ring axiom — clicking it is wrong for "NOT part of definition"
    await page.getByRole('button', { name: /\(R, \+\) is an abelian group/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Rings and ideals — NumericInput flow (units of ℤ/7ℤ)', () => {
  const SLIDE = `${BASE}/03-fields/02-examples-of-fields`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#rng-fields-num-fp-units`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('7');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('6');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('6');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Rings and ideals — ProofReveal flow (ideals in a field)', () => {
  const SLIDE = `${BASE}/05-ideals/04-fields-have-two-ideals`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#rng-ideals-proof-field-ideals`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/If I = \(0\)/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/If I = \(0\)/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/If I = \(0\)/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Rings and ideals — Problem flow (ℝ[x]/(x²+1) is ℂ)', () => {
  const SLIDE = `${BASE}/09-problems/01-standard`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#rng-prob-Rx-mod-x2plus1`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "isomorphism" only appears inside the solution text, not the prompt/hint
    await expect(article.getByText(/isomorphism sends x/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/isomorphism sends x/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
