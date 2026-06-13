import { test, expect } from '@playwright/test';

const BASE = '/part-6-representation-theory/02-semisimple-algebras';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Schur's lemma continued
  { url: `${BASE}/01-schurs-lemma-continued/01-hom-of-irreps`, heading: /hom-spaces between irreps/i },
  { url: `${BASE}/01-schurs-lemma-continued/02-hom-of-direct-sums`, heading: /hom-spaces of direct sums/i },
  { url: `${BASE}/01-schurs-lemma-continued/03-schur-for-comp-reducible`, heading: /schur.*completely reducible/i },
  { url: `${BASE}/01-schurs-lemma-continued/04-schur-check`, heading: /checking schur.*worked example/i },
  // Section 2 — Density theorem
  { url: `${BASE}/02-density-theorem/01-statement`, heading: /jacobson density theorem.*statement/i },
  { url: `${BASE}/02-density-theorem/02-proof-r1`, heading: /density theorem.*proof for one irrep/i },
  { url: `${BASE}/02-density-theorem/03-density-example`, heading: /density theorem.*explicit example/i },
  // Section 3 — Semisimple algebras
  { url: `${BASE}/03-semisimple-algebras/01-definition`, heading: /semisimple algebras.*definition/i },
  { url: `${BASE}/03-semisimple-algebras/02-main-theorem`, heading: /semisimple algebras.*main theorem/i },
  { url: `${BASE}/03-semisimple-algebras/03-sum-of-squares`, heading: /sum of squares formula/i },
  { url: `${BASE}/03-semisimple-algebras/04-semisimple-check`, heading: /checking semisimplicity/i },
  // Section 4 — Maschke's theorem
  { url: `${BASE}/04-maschkes-theorem/01-statement`, heading: /maschke.*theorem.*statement/i },
  { url: `${BASE}/04-maschkes-theorem/02-averaging-map`, heading: /maschke.*proof.*averaging map/i },
  { url: `${BASE}/04-maschkes-theorem/03-verify-averaging`, heading: /maschke.*proof.*verifying the averaging map/i },
  { url: `${BASE}/04-maschkes-theorem/04-inner-product-proof`, heading: /inner product proof/i },
  // Section 5 — Representations of S₃
  { url: `${BASE}/05-representations-of-s3/01-counting-irreps`, heading: /representations.*counting irreps/i },
  { url: `${BASE}/05-representations-of-s3/02-trivial-and-sign`, heading: /trivial and sign representations/i },
  { url: `${BASE}/05-representations-of-s3/03-reflection-rep`, heading: /reflection representation/i },
  { url: `${BASE}/05-representations-of-s3/04-decomposition-check`, heading: /decomposing the permutation representation/i },
  // Section 6 — Problems
  { url: `${BASE}/06-problems/01-standard`, heading: /problems.*standard/i },
  { url: `${BASE}/06-problems/02-starred`, heading: /problems.*starred/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Semisimple algebras — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Semisimple algebras — KaTeX renders', () => {
  test('sum-of-squares slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-semisimple-algebras/03-sum-of-squares`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Semisimple algebras — MCQ flow (identify semisimple algebra)', () => {
  const SLIDE = `${BASE}/03-semisimple-algebras/04-semisimple-check`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#ssa-semisimple-mcq-identify`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // ℂ × ℂ is the correct semisimple algebra
    await page.getByRole('button', { name: /ℂ × ℂ — the product of two copies of ℂ/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // dual numbers are not semisimple — clicking them is wrong
    await page.getByRole('button', { name: /ℂ\[x\] \/ \(x²\) — the algebra of dual numbers/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Semisimple algebras — NumericInput flow (dimension of refl₀)', () => {
  const SLIDE = `${BASE}/05-representations-of-s3/04-decomposition-check`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#ssa-s3-num-dim-reflection`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
    await input.fill('3');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('2');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('2');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Semisimple algebras — ProofReveal flow (Maschke P(w) = w)', () => {
  const SLIDE = `${BASE}/04-maschkes-theorem/03-verify-averaging`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#ssa-maschke-proof-P-fixes-W`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Averaging \|G\| equal terms w/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Averaging \|G\| equal terms w/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Averaging \|G\| equal terms w/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Semisimple algebras — Problem flow (irreps of finite group are finite-dim)', () => {
  const SLIDE = `${BASE}/06-problems/01-standard`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#ssa-prob-irreps-finite-dim`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "spanned by at most |G| vectors" only appears inside the solution text
    await expect(article.getByText(/spanned by at most/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).nth(2).click();
    await expect(article.getByText(/spanned by at most/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
