import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/01-groups/08-problems';

const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  { url: `${BASE}/01-warm-up-joke`, heading: /Warm-up — a group-theoretic joke/i },
  { url: `${BASE}/02-three-standards`, heading: /Three standard problems/i },
  { url: `${BASE}/03-prime-order-cyclic`, heading: /Groups of prime order/i },
  { url: `${BASE}/04-cayley`, heading: /Cayley's theorem/i },
  { url: `${BASE}/05-orders-and-fibonacci`, heading: /Two problems exploiting orders/i },
  { url: `${BASE}/06-imo-markers`, heading: /An olympiad invariant from D/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Groups · Problems section — slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

test.describe('Groups · Problems section — joke slide has the figure image', () => {
  test('warm-up slide renders the love-isomorphic-subgroup img', async ({ page }) => {
    await page.goto(`${BASE}/01-warm-up-joke`);
    const img = page.locator('img[src="/figures/groups/love-isomorphic-subgroup.jpg"]');
    await expect(img).toBeVisible();
  });
});

test.describe('Groups · Problems section — KaTeX renders', () => {
  test('IMO markers slide renders inline math (D_6 reference in the heading area)', async ({
    page,
  }) => {
    // The 06-imo-markers slide and 05-orders-and-fibonacci slide both contain
    // inline math via the prose voice; assert KaTeX has produced rendered output.
    await page.goto(`${BASE}/05-orders-and-fibonacci`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

test.describe('Groups · Problems — Problem two-stage reveal flow', () => {
  // Use the prime-order problem (its own slide, single Problem on the page).
  const SLIDE = `${BASE}/03-prime-order-cyclic`;
  const PROBLEM_KEY = `napkin:exercise:${SLIDE}#grp-prob-prime-order`;

  test('Show hint reveals hint without writing storage; Show solution reveals solution and persists', async ({
    page,
  }) => {
    await page.goto(SLIDE);

    // Hint and solution texts should not be on the page yet.
    await expect(page.getByText(/Pick a non-identity element/i)).toBeHidden();
    await expect(page.getByText(/Let G be a group of order p, and pick any element/i)).toBeHidden();

    // Click "Show hint".
    await page.getByRole('button', { name: /show hint/i }).click();

    // Hint visible, solution still hidden, localStorage NOT yet set.
    await expect(page.getByText(/Pick a non-identity element/i)).toBeVisible();
    await expect(page.getByText(/Let G be a group of order p, and pick any element/i)).toBeHidden();
    expect(
      await page.evaluate((k) => window.localStorage.getItem(k), PROBLEM_KEY),
    ).toBeNull();

    // Click "Show solution".
    await page.getByRole('button', { name: /show solution/i }).click();

    // Solution visible; hint remains visible; localStorage now records 'revealed'.
    await expect(page.getByText(/Let G be a group of order p, and pick any element/i)).toBeVisible();
    await expect(page.getByText(/Pick a non-identity element/i)).toBeVisible();
    expect(
      await page.evaluate((k) => window.localStorage.getItem(k), PROBLEM_KEY),
    ).toContain('"outcome":"revealed"');

    // Reload — both hint and solution should still be visible (rehydrated).
    await page.reload();
    await expect(page.getByText(/Let G be a group of order p, and pick any element/i)).toBeVisible();
    await expect(page.getByText(/Pick a non-identity element/i)).toBeVisible();
  });
});
