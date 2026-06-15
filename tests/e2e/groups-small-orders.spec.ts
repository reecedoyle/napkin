import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/01-groups/06-small-orders';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Groups · Small orders — KaTeX renders', () => {
  test('order-8 slide renders quaternion-group display math (i^2 = j^2 = k^2 = ijk = -1)', async ({
    page,
  }) => {
    await page.goto(`${BASE}/03-order-8`);
    // The quaternion-group callout has two display-math blocks: the list of
    // elements and the relations i^2 = j^2 = k^2 = ijk = -1.
    const displays = page.locator('.katex-display');
    await expect(displays.first()).toBeVisible();
    // Confirm the relations display in particular renders.
    await expect(page.locator('.katex-display', { hasText: 'ijk' })).toBeVisible();
  });
});

test.describe('Groups · Small orders — NumericInput flow (count of order-8 groups)', () => {
  const SLIDE = `${BASE}/03-order-8`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#grp-small-num-count-order-8`;

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

test.describe('Groups · Small orders — MCQ flow (Z/10Z = Z/5Z × Z/2Z by CRT)', () => {
  const SLIDE = `${BASE}/04-orders-9-and-10`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#grp-small-mcq-z10-crt`;

  test('correct answer is recorded and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /z\/10z and z\/5z × z\/2z/i }).click();

    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /z\/4z and z\/2z × z\/2z/i }).click();

    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});
