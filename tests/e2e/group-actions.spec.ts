import { test, expect } from '@playwright/test';

const BASE = '/part-5-more-on-groups/01-group-actions';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Definition of a group action
  { url: `${BASE}/01-definition-of-a-group-action/01-aime-motivation`, heading: /aime motivation/i },
  { url: `${BASE}/01-definition-of-a-group-action/02-definition`, heading: /group action.*definition/i },
  { url: `${BASE}/01-definition-of-a-group-action/03-examples`, heading: /examples of group actions/i },
  { url: `${BASE}/01-definition-of-a-group-action/04-homomorphism-view`, heading: /actions as homomorphisms/i },
  // Section 2 — Stabilizers and orbits
  { url: `${BASE}/02-stabilizers-and-orbits/01-equivalence-relation`, heading: /induced equivalence relation/i },
  { url: `${BASE}/02-stabilizers-and-orbits/02-orbits`, heading: /^orbits$/i },
  { url: `${BASE}/02-stabilizers-and-orbits/03-stabilizers`, heading: /^stabilizers$/i },
  { url: `${BASE}/02-stabilizers-and-orbits/04-orbit-stabilizer`, heading: /orbit-stabilizer theorem/i },
  { url: `${BASE}/02-stabilizers-and-orbits/05-orbit-stabilizer-check`, heading: /using orbit-stabilizer/i },
  // Section 3 — Burnside's lemma
  { url: `${BASE}/03-burnsides-lemma/01-fixed-points`, heading: /fixed points of an action/i },
  { url: `${BASE}/03-burnsides-lemma/02-statement`, heading: /burnside.*lemma/i },
  { url: `${BASE}/03-burnsides-lemma/03-aime-solution`, heading: /burnside in action/i },
  { url: `${BASE}/03-burnsides-lemma/04-spinner-exercise`, heading: /burnside exercise/i },
  { url: `${BASE}/03-burnsides-lemma/05-burnside-proof-sketch`, heading: /burnside.*proof sketch/i },
  // Section 4 — Conjugation of elements
  { url: `${BASE}/04-conjugation-of-elements/01-conjugation-action`, heading: /conjugation.*g acting/i },
  { url: `${BASE}/04-conjugation-of-elements/02-conjugation-in-sn`, heading: /conjugation in s_n/i },
  { url: `${BASE}/04-conjugation-of-elements/03-conjugacy-classes-sn`, heading: /conjugacy classes of s_n/i },
  { url: `${BASE}/04-conjugation-of-elements/04-center`, heading: /the center z\(g\)/i },
  { url: `${BASE}/04-conjugation-of-elements/05-centralizer-order`, heading: /centralizer and order/i },
  // Section 5 — Problems
  { url: `${BASE}/05-problems/01-standard-problems`, heading: /bracelets and conjugacy/i },
  { url: `${BASE}/05-problems/02-starred-daggered`, heading: /class equation and normality/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Group actions — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
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

    const input = page.getByPlaceholder('a number').first();
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
