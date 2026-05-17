import { test, expect } from '@playwright/test';

const GROUPS = '/part-1-starting-out/01-groups/01-hello';
const TOPOLOGY = '/part-1-starting-out/02-metric-topology/01-hello';

const MCQ_KEY = `napkin:exercise:${GROUPS}#smoke-mcq`;

// Wipe localStorage before each test so we don't leak state from earlier tests.
// Astro stores nothing else, so a wholesale clear is fine.
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('home page', () => {
  test('lists the two pilot chapters', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'An Infinitely Large Napkin' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Chapter 1.*Groups/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Chapter 2.*Metric Topology/ })).toBeVisible();
  });
});

test.describe('Callout + Napkin KaTeX macros (groups smoke slide)', () => {
  test('Callout renders with title and resolves \\ZZ / \\Zc{n} macros', async ({ page }) => {
    await page.goto(GROUPS);

    const callout = page.getByRole('note', { name: /Definition.*Group/ });
    await expect(callout).toBeVisible();

    // KaTeX renders \ZZ as a styled \mathbb{Z}; we just check the rendered
    // text content shows up at all (the .katex node is visible).
    await expect(callout.locator('.katex').first()).toBeVisible();
  });
});

test.describe('MCQ exercise (groups smoke slide)', () => {
  test('correct answer is recorded and persists across reloads', async ({ page }) => {
    await page.goto(GROUPS);
    await page.getByRole('button', { name: 'The integers' }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:')).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(GROUPS);
    await page.getByRole('button', { name: /natural numbers/ }).click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

test.describe('NumericInput + ProofReveal (metric-topology smoke slide)', () => {
  test('KaTeX renders inline and display math', async ({ page }) => {
    await page.goto(TOPOLOGY);
    await expect(page.locator('.katex').first()).toBeVisible();
    await expect(page.locator('.katex-display').first()).toBeVisible();
  });

  test('KaTeX MathML is visually hidden (no double-rendering)', async ({ page }) => {
    await page.goto(TOPOLOGY);
    // KaTeX renders math twice: once as MathML for screen readers (must be
    // visually hidden, ~1px clipped) and once as styled HTML. If the KaTeX
    // CSS isn't loaded properly, the MathML leaks visually and you see
    // every formula twice.
    const mathmlBox = await page.locator('.katex-mathml').first().boundingBox();
    expect(mathmlBox).not.toBeNull();
    expect(mathmlBox!.width).toBeLessThanOrEqual(2);
    expect(mathmlBox!.height).toBeLessThanOrEqual(2);
  });

  test('Figure component renders inline SVG with a caption', async ({ page }) => {
    await page.goto(TOPOLOGY);
    const figure = page.getByRole('figure', {
      name: /An r-neighborhood: a point p/,
    });
    await expect(figure).toBeVisible();
    await expect(figure.locator('svg')).toBeVisible();
    await expect(figure.getByText(/An r-neighborhood of p/)).toBeVisible();
  });

  test('correct numeric answer is accepted; wrong is rejected; correct persists', async ({ page }) => {
    await page.goto(TOPOLOGY);

    // Wrong answer first.
    await page.getByPlaceholder('a number').fill('99');
    await page.getByRole('button', { name: /check/i }).click();
    await expect(page.getByText(/not quite/i)).toBeVisible();

    // Correct answer.
    await page.getByPlaceholder('a number').fill('5');
    await page.getByRole('button', { name: /check/i }).click();
    await expect(page.getByText('Correct.')).toBeVisible();

    // Persists across reload.
    await page.reload();
    await expect(page.getByText('Correct.')).toBeVisible();
    await expect(page.getByPlaceholder('a number')).toHaveValue('5');
  });

  test('proof reveal shows the solution and persists', async ({ page }) => {
    await page.goto(TOPOLOGY);

    // Scope to the article so we don't collide with Astro's
    // hydration-payload <script> tag, which contains the same prop strings.
    const article = page.getByRole('article');

    await expect(article.getByText(/By definition of a metric/)).toBeHidden();
    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/By definition of a metric/)).toBeVisible();

    await page.reload();
    await expect(article.getByText(/By definition of a metric/)).toBeVisible();
  });
});
