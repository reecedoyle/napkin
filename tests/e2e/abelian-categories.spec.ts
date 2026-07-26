import { test, expect } from '@playwright/test';

const BASE = '/part-17-category-theory/04-abelian-categories';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Abelian categories — KaTeX renders', () => {
  test('kernel definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-zero-objects-kernels-cokernels/04-kernels`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Abelian categories — MCQ flow (which is NOT additive)', () => {
  const SLIDE = `${BASE}/02-additive-and-abelian-categories/03-examples`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#abcat-02-mcq-not-additive`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Grp is NOT additive — correct answer is "d"
    await page.getByRole('button', { name: 'Grp (all groups)', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // Ab IS additive — clicking it is wrong for the "NOT additive" question
    await page.getByRole('button', { name: 'Ab (abelian groups)', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Abelian categories — NumericInput flow (cokernel size)', () => {
  const SLIDE = `${BASE}/03-exact-sequences/04-more-examples`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#abcat-03-num-cokernel-size`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('7');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('12');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('12');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Abelian categories — ProofReveal flow (monic ⟹ trivial kernel)', () => {
  const SLIDE = `${BASE}/02-additive-and-abelian-categories/04-monic-iff-trivial-kernel`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#abcat-02-proof-monic-implies-zero-kernel`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/f∘g = f∘0 forces g = 0/)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/f∘g = f∘0 forces g = 0/).first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/f∘g = f∘0 forces g = 0/)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Abelian categories — Problem flow (four lemma)', () => {
  const SLIDE = `${BASE}/06-problems/01-four-lemma`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#abcat-06-prob-four-lemma`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // This phrase only appears inside the solution text, not the prompt/hint
    await expect(article.getByText(/we may cancel it to get p\(a\) = b/)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/we may cancel it to get p\(a\) = b/)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
