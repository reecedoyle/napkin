import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/02-metric-topology/08-problems';

const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  { url: `${BASE}/01-warm-up-and-q-vs-n`, heading: /Warm-up — continuity of d, and Q vs N/i },
  { url: `${BASE}/02-arithmetic-continued`, heading: /Continuity of arithmetic, continued/i },
  { url: `${BASE}/03-continuous-at-zero`, heading: /A function continuous at exactly one point/i },
  { url: `${BASE}/04-strictly-increasing`, heading: /Strictly increasing implies continuous somewhere/i },
  { url: `${BASE}/05-one-over-x`, heading: /Is 1\/x continuous\? An Internet debate/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Metric topology · Problems section — slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

test.describe('Metric topology · Problems section — KaTeX renders', () => {
  test('strictly-increasing slide renders KaTeX-formatted math', async ({ page }) => {
    await page.goto(`${BASE}/04-strictly-increasing`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

test.describe('Metric topology · Problems — Problem two-stage reveal (Q vs N has hint+solution)', () => {
  // The Q-vs-N problem on slide 01 has both a hint and a solution.
  const SLIDE = `${BASE}/01-warm-up-and-q-vs-n`;
  const PROBLEM_KEY = `napkin:exercise:${SLIDE}#top-prob-q-vs-n`;

  test('Show hint reveals hint without writing storage; Show solution reveals solution and persists', async ({
    page,
  }) => {
    await page.goto(SLIDE);

    // Hint text and a solution-only phrase should not be on the page yet.
    await expect(
      page.getByText(/There isn't even a continuous injective map/i),
    ).toBeHidden();
    await expect(page.getByText(/Metric approach\. Suppose f : Q/i)).toBeHidden();

    // Click "Show hint". Only the Q-vs-N problem has a hint (the d-continuous
    // problem on this slide has none), so there's a single Show-hint button.
    await page.getByRole('button', { name: /show hint/i }).click();

    // Hint visible, solution still hidden, localStorage NOT yet set.
    await expect(
      page.getByText(/There isn't even a continuous injective map/i),
    ).toBeVisible();
    await expect(page.getByText(/Metric approach\. Suppose f : Q/i)).toBeHidden();
    expect(
      await page.evaluate((k) => window.localStorage.getItem(k), PROBLEM_KEY),
    ).toBeNull();

    // Click "Show solution" — after a hint reveal there's exactly one solution
    // button visible (the second Problem's), since the first Problem still
    // shows its own original Show solution.
    // To be safe, pick the solution button that appears alongside the hint
    // (i.e. the second Show-solution button on the page).
    const solutionButtons = page.getByRole('button', { name: /show solution/i });
    await solutionButtons.last().click();

    // Solution visible; hint remains visible; localStorage now records 'revealed'.
    await expect(page.getByText(/Metric approach\. Suppose f : Q/i)).toBeVisible();
    await expect(
      page.getByText(/There isn't even a continuous injective map/i),
    ).toBeVisible();
    expect(
      await page.evaluate((k) => window.localStorage.getItem(k), PROBLEM_KEY),
    ).toContain('"outcome":"revealed"');

    // Reload — both hint and solution should still be visible (rehydrated).
    await page.reload();
    await expect(page.getByText(/Metric approach\. Suppose f : Q/i)).toBeVisible();
    await expect(
      page.getByText(/There isn't even a continuous injective map/i),
    ).toBeVisible();
  });
});

test.describe('Metric topology · Problems — Problem without hint (continuity of d)', () => {
  // The d-continuous problem on slide 01 has NO hint — only a Show solution
  // button. We verify the single-stage reveal flow.
  const SLIDE = `${BASE}/01-warm-up-and-q-vs-n`;
  const PROBLEM_KEY = `napkin:exercise:${SLIDE}#top-prob-d-continuous`;

  test('Show solution reveals solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    // Solution body should be hidden initially.
    await expect(page.getByText(/Use the triangle inequality twice/i)).toBeHidden();

    // The first Show-solution button is the d-continuous one.
    await page.getByRole('button', { name: /show solution/i }).first().click();

    await expect(page.getByText(/Use the triangle inequality twice/i)).toBeVisible();
    expect(
      await page.evaluate((k) => window.localStorage.getItem(k), PROBLEM_KEY),
    ).toContain('"outcome":"revealed"');

    await page.reload();
    await expect(page.getByText(/Use the triangle inequality twice/i)).toBeVisible();
  });
});
