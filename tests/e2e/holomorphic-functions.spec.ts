import { test, expect } from '@playwright/test';

const BASE = '/part-9-complex-analysis/01-holomorphic-functions';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Holomorphic functions — KaTeX renders', () => {
  test('contour integral slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-contour-integrals/01-integrating-along-curves`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Holomorphic functions — MCQ flow (what makes ℂ special)', () => {
  const SLIDE = `${BASE}/01-the-nicest-functions-on-earth/02-what-makes-cc-special`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#holo-s1-mcq-cc-special`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // "ℂ is a field" is the correct answer (b)
    await page.getByRole('button', { name: /ℂ is a field, so we can divide complex numbers/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // "ℂ has two real dimensions" is wrong
    await page.getByRole('button', { name: /ℂ has two real dimensions/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Holomorphic functions — NumericInput flow (backwards contour)', () => {
  const SLIDE = `${BASE}/03-contour-integrals/03-backwards-contour`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#holo-s3-num-backwards`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('7');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('-7');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('-7');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Holomorphic functions — ProofReveal flow (conjugate not holomorphic)', () => {
  const SLIDE = `${BASE}/02-complex-differentiation/02-stronger-than-real`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#holo-s2-proof-conj-not-holo`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/from every direction/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/from every direction/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/from every direction/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Holomorphic functions — Problem flow (Liouville)', () => {
  const SLIDE = `${BASE}/08-problems/01-liouville-and-zeros`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#holo-prob-liouville`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "letting R → ∞ forces" only appears inside the solution text
    await expect(article.getByText(/letting R/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/letting R/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
