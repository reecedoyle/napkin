import { test, expect } from '@playwright/test';

const BASE = '/part-16-algebraic-topology-i-homotopy/03-covering-projections';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Covering projections — KaTeX renders', () => {
  test('why-covering-projections slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-even-coverings-and-covering-projections/01-why-covering-projections`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Covering projections — MCQ flow (why U = S¹ is not evenly covered)', () => {
  const SLIDE = `${BASE}/01-even-coverings-and-covering-projections/05-real-line-covers-circle`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#cp65-even-cov-mcq-full-circle-not-evenly-covered`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page
      .getByRole('button', {
        name: 'p⁻¹(S¹) = ℝ is not a disjoint union of sets homeomorphic to S¹',
        exact: true,
      })
      .click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page
      .getByRole('button', { name: 'p is not continuous on all of ℝ', exact: true })
      .click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Covering projections — NumericInput flow (net winding number)', () => {
  const SLIDE = `${BASE}/03-lifting-correspondence/06-fundamental-group-of-circle`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#cp65-lift-corr-num-winding-number`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('1');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('1');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Covering projections — ProofReveal flow (surjectivity of a covering projection)', () => {
  const SLIDE = `${BASE}/01-even-coverings-and-covering-projections/03-covering-projection-definition`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#cp65-even-cov-proof-surjectivity`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "simultaneously open and closed" only appears in the hidden solution.
    await expect(article.getByText(/simultaneously open and closed/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/simultaneously open and closed/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/simultaneously open and closed/i)).toBeVisible();
  });
});
