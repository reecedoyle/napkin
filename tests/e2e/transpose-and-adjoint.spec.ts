import { test, expect } from '@playwright/test';

const BASE = '/part-4-linear-algebra/07-transpose-and-adjoint';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Dual of a map
  { url: `${BASE}/01-dual-of-a-map/01-the-dual-map`, heading: /the dual map/i },
  { url: `${BASE}/01-dual-of-a-map/02-example`, heading: /computing a dual map/i },
  { url: `${BASE}/01-dual-of-a-map/03-transpose-theorem`, heading: /transpose interpretation of the dual map/i },
  { url: `${BASE}/01-dual-of-a-map/04-basis-free`, heading: /the basis-free view of transpose/i },
  // Section 2 — Cautionary tale
  { url: `${BASE}/02-cautionary-tale/01-motivation`, heading: /a tale of a non-canonical isomorphism/i },
  { url: `${BASE}/02-cautionary-tale/02-false-theorem`, heading: /a false theorem and its bogus proof/i },
  { url: `${BASE}/02-cautionary-tale/03-counterexample`, heading: /the counterexample/i },
  // Section 3 — Identifying the dual
  { url: `${BASE}/03-identifying-the-dual/01-inner-product-spaces`, heading: /using the inner product to identify/i },
  { url: `${BASE}/03-identifying-the-dual/02-real-isomorphism`, heading: /v.*v.*for real inner product spaces/i },
  { url: `${BASE}/03-identifying-the-dual/03-complex-obstruction`, heading: /why the complex case is different/i },
  // Section 4 — Adjoint
  { url: `${BASE}/04-adjoint/01-definition`, heading: /the adjoint map/i },
  { url: `${BASE}/04-adjoint/02-example`, heading: /computing an adjoint over/i },
  { url: `${BASE}/04-adjoint/03-conjugate-transpose-theorem`, heading: /adjoints are conjugate transposes/i },
  { url: `${BASE}/04-adjoint/04-check`, heading: /adjoint.*quick check/i },
  // Section 5 — Eigenvalues of normal maps
  { url: `${BASE}/05-eigenvalues-of-normal-maps/01-normal-maps`, heading: /normal and hermitian maps/i },
  { url: `${BASE}/05-eigenvalues-of-normal-maps/02-spectral-theorem`, heading: /the spectral theorem/i },
  { url: `${BASE}/05-eigenvalues-of-normal-maps/03-proof-sketch`, heading: /proof sketch.*key steps/i },
  { url: `${BASE}/05-eigenvalues-of-normal-maps/04-hermitian-real-eigenvalues`, heading: /hermitian matrices have real eigenvalues/i },
  { url: `${BASE}/05-eigenvalues-of-normal-maps/05-big-picture`, heading: /big picture.*what we have proved/i },
  // Section 6 — Problems
  { url: `${BASE}/06-problems/01-double-dual-and-fundamental`, heading: /problems.*double dual and fundamental/i },
  { url: `${BASE}/06-problems/02-row-rank-and-complex-conj`, heading: /problems.*row rank and complex conjugate/i },
  { url: `${BASE}/06-problems/03-tdagger-vs-tvee-and-polynomial`, heading: /problems.*t.*and polynomial/i },
  { url: `${BASE}/06-problems/04-kronecker-and-rank`, heading: /problems.*kronecker.*and rank/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Transpose and adjoint — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Transpose and adjoint — KaTeX renders', () => {
  test('dual map definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-dual-of-a-map/01-the-dual-map`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Transpose and adjoint — MCQ flow (domain of T∨)', () => {
  const SLIDE = `${BASE}/01-dual-of-a-map/04-basis-free`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#trn-dual-mcq-direction`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // W∨ is the correct domain
    await page.getByRole('button', { name: /W∨ \(the dual of W\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // V∨ is wrong
    await page.getByRole('button', { name: /V∨ \(the dual of V\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Transpose and adjoint — NumericInput flow (rank of M)', () => {
  const SLIDE = `${BASE}/02-cautionary-tale/03-counterexample`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#trn-ct-num-rank-m`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
    await input.fill('2');
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
test.describe('Transpose and adjoint — ProofReveal flow (transpose theorem)', () => {
  const SLIDE = `${BASE}/01-dual-of-a-map/03-transpose-theorem`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#trn-dual-proof-transpose`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/coefficient of e_j/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/coefficient of e_j/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/coefficient of e_j/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Transpose and adjoint — Problem flow (double dual)', () => {
  const SLIDE = `${BASE}/06-problems/01-double-dual-and-fundamental`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#trn-prob-double-dual`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "canonical" only appears inside the solution, not the prompt/hint
    await expect(article.getByText(/evaluation pairing/i).first()).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/evaluation pairing/i).first()).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
