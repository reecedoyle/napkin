import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/01-groups/04-orders-and-lagrange';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Groups · Orders and Lagrange section — KaTeX renders', () => {
  test('Lagrange slide renders display math (theorem statement)', async ({ page }) => {
    await page.goto(`${BASE}/05-lagrange-orders`);
    await expect(page.locator('.katex-display').first()).toBeVisible();
  });
});

test.describe('Groups · Orders and Lagrange — NumericInput flow (order of 2 in Z/6)', () => {
  const SLIDE = `${BASE}/02-order-of-an-element`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#grp-ord-num-2-in-z6`;

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

test.describe('Groups · Orders and Lagrange — MCQ flow (Lagrange consequence)', () => {
  const SLIDE = `${BASE}/05-lagrange-orders`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#grp-ord-mcq-lagrange-consequence`;

  test('correct answer is recorded and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /ord\(x\) is one of 1, 3, 5, or 15/i }).click();

    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /ord\(x\) = 15\./i }).click();

    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

test.describe('Groups · Orders and Lagrange — ProofReveal flow (order divides)', () => {
  const SLIDE = `${BASE}/03-order-divides`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#grp-ord-proof-divides`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/by the division algorithm/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/by the division algorithm/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/by the division algorithm/i)).toBeVisible();
  });
});
