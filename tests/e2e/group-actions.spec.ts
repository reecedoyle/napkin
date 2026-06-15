import { test, expect } from '@playwright/test';

const BASE = '/part-5-more-on-groups/01-group-actions';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Group actions — KaTeX renders', () => {
  test('orbit-stabilizer theorem slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-stabilizers-and-orbits/04-orbit-stabilizer`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Group actions — MCQ flow (Stab_{S_4}(1))', () => {
  const SLIDE = `${BASE}/02-stabilizers-and-orbits/05-orbit-stabilizer-check`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#act-orb-mcq-stab-s4`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Correct: permutations of {2,3,4} — isomorphic to S_3
    await page.getByRole('button', { name: /permutations of \{2, 3, 4\}/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // Wrong: "Only the identity permutation"
    await page.getByRole('button', { name: /only the identity permutation/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Group actions — NumericInput flow (spinner colorings)', () => {
  const SLIDE = `${BASE}/03-burnsides-lemma/04-spinner-exercise`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#act-burn-num-spinner`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
    await input.fill('128');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('20');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('20');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Group actions — ProofReveal flow (homomorphism view)', () => {
  const SLIDE = `${BASE}/01-definition-of-a-group-action/04-homomorphism-view`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#act-def-proof-hom-view`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/consequence of/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/consequence of/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/consequence of/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Group actions — Problem flow (bracelet counting)', () => {
  const SLIDE = `${BASE}/05-problems/01-standard-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#act-prob-bracelet`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "2772" only appears in the solution text, not in the prompt or hint
    await expect(article.getByText(/2772/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/2772/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
