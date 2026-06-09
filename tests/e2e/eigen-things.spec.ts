import { test, expect } from '@playwright/test';

const BASE = '/part-4-linear-algebra/02-eigen-things';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Why you should care
  { url: `${BASE}/01-why-you-should-care/01-diagonal-maps`, heading: /the simplest linear maps/i },
  { url: `${BASE}/01-why-you-should-care/02-change-of-basis-luck`, heading: /getting lucky/i },
  { url: `${BASE}/01-why-you-should-care/03-goal`, heading: /the goal/i },
  // Section 2 — Assumptions
  { url: `${BASE}/02-assumptions/01-what-we-need`, heading: /assumptions/i },
  // Section 3 — Eigenvectors and eigenvalues
  { url: `${BASE}/03-eigenvectors-and-eigenvalues/01-definition`, heading: /eigenvectors and eigenvalues.*definition/i },
  { url: `${BASE}/03-eigenvectors-and-eigenvalues/02-eigenspace`, heading: /eigenspaces/i },
  { url: `${BASE}/03-eigenvectors-and-eigenvalues/03-eigenvalues-need-not-exist`, heading: /eigenvalues need not exist/i },
  // Section 4 — The Jordan form
  { url: `${BASE}/04-the-jordan-form/01-jordan-blocks`, heading: /jordan blocks/i },
  { url: `${BASE}/04-the-jordan-form/02-jordan-canonical-form-theorem`, heading: /jordan canonical form theorem/i },
  { url: `${BASE}/04-the-jordan-form/03-concrete-example`, heading: /concrete example/i },
  // Section 5 — Nilpotent maps
  { url: `${BASE}/05-nilpotent-maps/01-definition`, heading: /nilpotent maps.*definition/i },
  { url: `${BASE}/05-nilpotent-maps/02-staircases`, heading: /independent staircases/i },
  { url: `${BASE}/05-nilpotent-maps/03-shifting-eigenvalue`, heading: /shifting the eigenvalue/i },
  // Section 6 — Reducing to nilpotent
  { url: `${BASE}/06-reducing-to-nilpotent/01-invariant-subspaces`, heading: /invariant subspaces/i },
  { url: `${BASE}/06-reducing-to-nilpotent/02-indecomposable-is-jordan`, heading: /indecomposable piece is a jordan block/i },
  // Section 7 — Proof of nilpotent Jordan
  { url: `${BASE}/07-proof-of-nilpotent-jordan/01-induction-setup`, heading: /induction setup/i },
  { url: `${BASE}/07-proof-of-nilpotent-jordan/02-extending-the-basis`, heading: /extending the basis/i },
  // Section 8 — Algebraic and geometric multiplicity
  { url: `${BASE}/08-algebraic-and-geometric-multiplicity/01-two-notions`, heading: /two notions/i },
  { url: `${BASE}/08-algebraic-and-geometric-multiplicity/02-definitions`, heading: /algebraic and geometric multiplicity.*definitions/i },
  { url: `${BASE}/08-algebraic-and-geometric-multiplicity/03-example-and-trace-det`, heading: /multiplicities in action/i },
  // Section 9 — Problems
  { url: `${BASE}/09-problems/01-standard-problems`, heading: /problems.*standard/i },
  { url: `${BASE}/09-problems/02-eigenspace-problems`, heading: /finding eigenspaces/i },
  { url: `${BASE}/09-problems/03-differentiation-problems`, heading: /differentiation operators/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Eigen-things — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Eigen-things — KaTeX renders', () => {
  test('Jordan form theorem slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/04-the-jordan-form/02-jordan-canonical-form-theorem`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Eigen-things — MCQ flow (which is an eigenvector)', () => {
  const SLIDE = `${BASE}/03-eigenvectors-and-eigenvalues/01-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#eig-def-mcq-which-is-eigenvector`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // e₁ is the 2-eigenvector — correct answer is "c"
    await page.getByRole('button', { name: /e₁\s+\(the vector \(1,0\)\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // e₂ is NOT an eigenvector — clicking it is wrong
    await page.getByRole('button', { name: /e₂\s+\(the vector \(0,1\)\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Eigen-things — NumericInput flow (algebraic multiplicity sum)', () => {
  const SLIDE = `${BASE}/08-algebraic-and-geometric-multiplicity/03-example-and-trace-det`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#eig-mult-num-alg-mult-sum`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
    await input.fill('1000');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('2018');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('2018');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Eigen-things — ProofReveal flow (eigenspace is a subspace)', () => {
  const SLIDE = `${BASE}/03-eigenvectors-and-eigenvalues/02-eigenspace`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#eig-eigenspace-proof-subspace`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/three subspace conditions/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/three subspace conditions/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/three subspace conditions/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Eigen-things — Problem flow (differentiation of polynomials)', () => {
  const SLIDE = `${BASE}/09-problems/03-differentiation-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#eig-prob-diff-poly`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "nonzero constants" only appears inside the solution, not the prompt/hint
    await expect(article.getByText(/nonzero constants/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/nonzero constants/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
