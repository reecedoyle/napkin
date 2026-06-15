import { test, expect } from '@playwright/test';

const BASE = '/part-6-representation-theory/04-applications';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Rep-theory applications — KaTeX renders', () => {
  test('Frobenius divisibility proof slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-frobenius-divisibility/03-proof-via-conjugacy-classes`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Rep-theory applications — MCQ flow (dim divides |G|)', () => {
  const SLIDE = `${BASE}/01-frobenius-divisibility/04-example-and-check`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#app-frob-mcq-dim-divides`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // 3 divides 15 — this is the correct answer
    await page.getByRole('button', { name: /^3$/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // 4 does not divide 15 — this is wrong
    await page.getByRole('button', { name: /^4$/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Rep-theory applications — NumericInput flow (smallest nonabelian group)', () => {
  const SLIDE = `${BASE}/02-burnsides-theorem/04-proof-of-burnside`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#app-bsd-num-min-order`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
    await input.fill('4');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('6');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('6');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Rep-theory applications — ProofReveal flow (ℤ[G] integral)', () => {
  const SLIDE = `${BASE}/01-frobenius-divisibility/02-group-ring-integral`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#app-frob-proof-zg-integral`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/monic polynomial of degree/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/monic polynomial of degree/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/monic polynomial of degree/i)).toBeVisible();
  });
});
