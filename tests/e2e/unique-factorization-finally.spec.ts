import { test, expect } from '@playwright/test';

const BASE = '/part-14-algebraic-nt-i-rings-of-integers/03-unique-factorization-finally';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Unique factorization — KaTeX renders', () => {
  test('ideal norm definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/07-the-ideal-norm/01-definition-and-examples`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Unique factorization — MCQ flow (key Dedekind condition)', () => {
  const SLIDE = `${BASE}/03-dedekind-domains/01-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#an55-ded-mcq-key-condition`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /every nonzero prime ideal is maximal/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /every ideal is principal/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Unique factorization — NumericInput flow (ideal norm of (3) in ℤ[i])', () => {
  const SLIDE = `${BASE}/07-the-ideal-norm/01-definition-and-examples`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#an55-norm-num-3-zi`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('9');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('9');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Unique factorization — ProofReveal flow (prime divisibility)', () => {
  const SLIDE = `${BASE}/02-ideal-arithmetic/03-ideal-divisibility`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#an55-arith-proof-prime-div`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/forces a ∈/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/forces a ∈/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/forces a ∈/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Unique factorization — Problem flow (Fermat for ideals)', () => {
  const SLIDE = `${BASE}/08-problems/03-fermat-little-theorem-ideals`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#an55-prob-fermat-ideals`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "multiplicative group" only appears inside the solution, not the prompt
    await expect(article.getByText(/multiplicative group/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/multiplicative group/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
