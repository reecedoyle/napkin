import { test, expect } from '@playwright/test';

const BASE = '/part-13-riemann-surfaces/03-affine-and-projective-plane-curves';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Affine and projective plane curves — KaTeX renders', () => {
  test('definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-affine-plane-curves/04-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Affine and projective plane curves — MCQ flow (smoothness condition)', () => {
  const SLIDE = `${BASE}/01-affine-plane-curves/04-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#rs49-affine-mcq-smooth-condition`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Correct answer: "So that the implicit function theorem gives local analytic coordinates"
    await page.getByRole('button', { name: /implicit function theorem gives local analytic coordinates/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // Wrong: "So that the zero set is bounded"
    await page.getByRole('button', { name: /zero set is bounded/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Affine and projective plane curves — NumericInput flow (degree of homogenisation)', () => {
  const SLIDE = `${BASE}/03-projective-plane-curves/03-homogeneous-polynomials`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#rs49-proj-num-degree`;

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

// ── ProofReveal flow (§1) ─────────────────────────────────────────────────────
test.describe('Affine and projective plane curves — ProofReveal flow (circle chart)', () => {
  const SLIDE = `${BASE}/01-affine-plane-curves/03-complex-charts`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#rs49-affine-proof-circle-chart`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/injective and analytic/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/injective and analytic/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/valid complex chart/i)).toBeVisible();
  });
});

// ── ProofReveal flow (§5) ─────────────────────────────────────────────────────
test.describe('Affine and projective plane curves — ProofReveal flow (nodes and genus)', () => {
  const SLIDE = `${BASE}/05-nodes-of-a-plane-curve/04-nodes-and-genus`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#rs49-node-proof-genus-check`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/pinch a torus at one point/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/pinch a torus at one point/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/pinch a torus at one point/i)).toBeVisible();
  });
});
