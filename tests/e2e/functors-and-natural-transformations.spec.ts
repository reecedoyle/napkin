import { test, expect } from '@playwright/test';

const BASE = '/part-17-category-theory/02-functors-and-natural-transformations';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Functors and natural transformations — KaTeX renders', () => {
  test('formal definition of a functor slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-covariant-functors/01-formal-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Functors and natural transformations — MCQ flow (Hom bifunctor variance)', () => {
  const SLIDE = `${BASE}/01-examples-of-functors/03-hom-as-a-bifunctor`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#fan67-ex-mcq-hom-variance`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // The first slot, A₁, is contravariant — that's the correct answer "a".
    await page.getByRole('button', { name: 'The first slot, A₁', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // The second slot, A₂, is covariant — wrong answer for this question.
    await page.getByRole('button', { name: 'The second slot, A₂', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Functors and natural transformations — NumericInput flow (Hom(ℤ, ℤ/5ℤ))', () => {
  const SLIDE = `${BASE}/07-yoneda-lemma/08-representing-a-functor`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#fan67-yon-num-hom-z-to-z5`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('4');
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
test.describe('Functors and natural transformations — ProofReveal flow (functors preserve isomorphism)', () => {
  const SLIDE = `${BASE}/02-covariant-functors/05-functors-preserve-isomorphism`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#fan67-cov-proof-functors-preserve-iso`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "two-sided inverse" only appears in the hidden solution, not the prompt.
    await expect(article.getByText(/two-sided inverse/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/two-sided inverse/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/two-sided inverse/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Functors and natural transformations — Problem flow (permutations vs. orderings)', () => {
  const SLIDE = `${BASE}/08-problems/02-permutations-vs-orderings`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#fan67-prob-perms-vs-orderings`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // This phrase only appears inside the solution text, not the prompt.
    await expect(article.getByText(/acts freely and transitively on orderings/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/acts freely and transitively on orderings/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
