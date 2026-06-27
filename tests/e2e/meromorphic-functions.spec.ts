import { test, expect } from '@playwright/test';

const BASE = '/part-9-complex-analysis/02-meromorphic-functions';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Meromorphic functions — KaTeX renders', () => {
  test('residue theorem slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-winding-numbers-and-residues/02-residue-theorem`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow — residue of e^z/z² ─────────────────────────────────────────────
test.describe('Meromorphic functions — MCQ flow (residue of e^z/z²)', () => {
  const SLIDE = `${BASE}/02-meromorphic-functions/02-poles-and-orders`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#mero-poles-mcq-residue`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // The correct answer is "1" (option b). exact: true so it doesn't also
    // match the "1/2" option button.
    await page.getByRole('button', { name: '1', exact: true }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // "0" is wrong
    await page.getByRole('button', { name: '0' }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow — pole order ────────────────────────────────────────────
test.describe('Meromorphic functions — NumericInput flow (pole order)', () => {
  const SLIDE = `${BASE}/02-meromorphic-functions/04-principal-part`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#mero-principal-num-order`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('3');
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

// ── ProofReveal flow — residue theorem proof ──────────────────────────────────
test.describe('Meromorphic functions — ProofReveal flow (residue theorem)', () => {
  const SLIDE = `${BASE}/03-winding-numbers-and-residues/03-proof-sketch`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#mero-winding-proof-residue`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Cauchy.Goursat/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Cauchy.Goursat/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Cauchy.Goursat/i)).toBeVisible();
  });
});

// ── Problem flow — FTA ────────────────────────────────────────────────────────
test.describe('Meromorphic functions — Problem flow (fundamental theorem of algebra)', () => {
  const SLIDE = `${BASE}/07-problems/01-standard-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#mero-prob-fta`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "A polynomial of degree n has no poles" only appears inside the solution
    await expect(article.getByText(/A polynomial of degree n has no poles/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/A polynomial of degree n has no poles/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
