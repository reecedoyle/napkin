import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/01-groups/02-properties';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Groups · Properties section — KaTeX renders', () => {
  test('notation slide renders KaTeX (display math for g^n)', async ({ page }) => {
    await page.goto(`${BASE}/01-notation`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });

  test('bijection example slide renders display math for the table', async ({ page }) => {
    await page.goto(`${BASE}/06-bijection-example`);
    await expect(page.locator('.katex-display').first()).toBeVisible();
  });
});

test.describe('Groups · Properties — MCQ flow (uniqueness proof)', () => {
  const SLIDE = `${BASE}/03-uniqueness`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#grp-prop-mcq-uniqueness-axiom`;

  test('correct answer is recorded and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /both \(a\) and \(b\)/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:')).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /Neither — the proof only uses associativity/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

test.describe('Groups · Properties — MCQ flow (cancellation law)', () => {
  const SLIDE = `${BASE}/07-cancellation-law`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#grp-prop-mcq-cancellation`;

  test('correct cancellation answer persists', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /^If gx = gy then x = y\.$/ }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:')).toBeVisible();
  });
});

test.describe('Groups · Properties — ProofReveal flow (inverse of product)', () => {
  const SLIDE = `${BASE}/04-inverse-of-products`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#grp-prop-proof-inverse-of-product`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/By the uniqueness of inverses/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/By the uniqueness of inverses/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/By the uniqueness of inverses/i)).toBeVisible();
  });
});

test.describe('Groups · Properties — ProofReveal flow (left-mult bijection)', () => {
  const SLIDE = `${BASE}/05-left-mult-bijection`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#grp-prop-proof-left-mult-bijection`;

  test('reveal exposes both injectivity and surjectivity', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Injective: suppose f\(x\) = f\(y\)/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Injective: suppose f\(x\) = f\(y\)/i)).toBeVisible();
    await expect(article.getByText(/Surjective: given any target y/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );
  });
});
