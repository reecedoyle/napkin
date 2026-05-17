import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/02-metric-topology/01-definition';

const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  { url: `${BASE}/01-what-is-a-metric-space`, heading: /What is a metric space\?/ },
  { url: `${BASE}/02-formal-definition`, heading: /definition of a metric space/i },
  { url: `${BASE}/03-real-line`, heading: /Metric spaces on the real line/i },
  { url: `${BASE}/04-euclidean-plane`, heading: /Euclidean plane/i },
  { url: `${BASE}/05-taxicab`, heading: /taxicab metric/i },
  { url: `${BASE}/06-rn-and-spheres`, heading: /Euclidean n-space, balls, and spheres/i },
  { url: `${BASE}/07-function-space`, heading: /metric on a space of functions/i },
  { url: `${BASE}/08-discrete-and-graphs`, heading: /Discrete spaces and graphs/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Metric topology · Definition section — slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

test.describe('Metric topology · Definition section — KaTeX renders', () => {
  test('formal definition slide renders KaTeX-formatted math', async ({ page }) => {
    await page.goto(`${BASE}/02-formal-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
    await expect(page.locator('.katex-display').first()).toBeVisible();
  });
});

test.describe('Metric topology · Definition — MCQ flow (axioms question)', () => {
  const SLIDE = `${BASE}/02-formal-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#top-def-mcq-axioms`;

  test('correct answer is recorded and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /commutativity/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:')).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /^symmetry:/i }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

test.describe('Metric topology · Definition — NumericInput flow (taxicab)', () => {
  const SLIDE = `${BASE}/05-taxicab`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#top-def-num-taxicab`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    await page.getByPlaceholder('a number').fill('5');
    await page.getByRole('button', { name: /check/i }).click();
    await expect(page.getByText(/not quite/i)).toBeVisible();

    await page.getByPlaceholder('a number').fill('7');
    await page.getByRole('button', { name: /check/i }).click();
    await expect(page.getByText('Correct.')).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.')).toBeVisible();
    await expect(page.getByPlaceholder('a number')).toHaveValue('7');
  });
});

test.describe('Metric topology · Definition — ProofReveal flow (discrete + graph axioms)', () => {
  const SLIDE = `${BASE}/08-discrete-and-graphs`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#top-def-proof-discrete-axioms`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/concatenate a shortest x-to-z path/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/concatenate a shortest x-to-z path/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/concatenate a shortest x-to-z path/i)).toBeVisible();
  });
});
