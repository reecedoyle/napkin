import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/01-groups/01-definition';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Groups · Definition section — KaTeX renders', () => {
  test('formal definition slide renders KaTeX-formatted math', async ({ page }) => {
    await page.goto(`${BASE}/04-formal-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });

  test('non-examples slide renders display math (matrix block)', async ({ page }) => {
    await page.goto(`${BASE}/05-non-examples`);
    await expect(page.locator('.katex-display').first()).toBeVisible();
  });
});

test.describe('Groups · Definition — Dihedral figure', () => {
  test('dihedral slide shows a figure containing an SVG', async ({ page }) => {
    await page.goto(`${BASE}/08-dihedral-group`);
    const figure = page.getByRole('figure', {
      name: /Five labelled regular pentagons/i,
    });
    await expect(figure).toBeVisible();
    await expect(figure.locator('svg')).toBeVisible();
    await expect(figure.getByText(/Five elements of the dihedral group/i)).toBeVisible();
  });
});

test.describe('Groups · Definition — MCQ flow (axioms question)', () => {
  const SLIDE = `${BASE}/04-formal-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#grp-def-mcq-axioms`;

  test('correct answer is recorded and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /commutative/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:')).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /there is an identity element/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

test.describe('Groups · Definition — NumericInput flow (D_10 order)', () => {
  const SLIDE = `${BASE}/10-which-are-groups`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#grp-def-num-d10-order`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    await page.getByPlaceholder('a number').fill('5');
    await page.getByRole('button', { name: /check/i }).click();
    await expect(page.getByText(/not quite/i)).toBeVisible();

    await page.getByPlaceholder('a number').fill('10');
    await page.getByRole('button', { name: /check/i }).click();
    await expect(page.getByText('Correct.')).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.')).toBeVisible();
    await expect(page.getByPlaceholder('a number')).toHaveValue('10');
  });
});

test.describe('Groups · Definition — ProofReveal flow (non-examples)', () => {
  const SLIDE = `${BASE}/05-non-examples`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#grp-def-proof-z-mult`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/most integers have no multiplicative inverse/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/most integers have no multiplicative inverse/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/most integers have no multiplicative inverse/i)).toBeVisible();
  });
});
