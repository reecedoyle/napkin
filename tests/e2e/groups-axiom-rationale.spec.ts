import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/01-groups/07-axiom-rationale';

const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  { url: `${BASE}/01-why-these-axioms`, heading: /why these axioms\?/i },
  { url: `${BASE}/02-associative-not-commutative`, heading: /associative, but not commutative/i },
  { url: `${BASE}/03-inverses-and-symmetry`, heading: /inverses and symmetry/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Groups · Axiom rationale section — slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

test.describe('Groups · Axiom rationale — KaTeX renders', () => {
  test('inverses-and-symmetry slide renders inline math (N for natural numbers)', async ({
    page,
  }) => {
    await page.goto(`${BASE}/03-inverses-and-symmetry`);
    // The first remark mentions (N, +) which uses \NN — confirm KaTeX rendered.
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

test.describe('Groups · Axiom rationale — MCQ flow (which fails to be a group)', () => {
  const SLIDE = `${BASE}/03-inverses-and-symmetry`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#grp-rat-mcq-not-a-group`;

  test('correct answer is recorded and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /fails the inverse axiom/i }).click();

    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /\(z, \+\) — fails associativity/i }).click();

    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});
