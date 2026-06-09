import { test, expect } from '@playwright/test';

const BASE = '/part-4-linear-algebra/03-dual-and-trace';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Tensor product
  { url: `${BASE}/01-tensor-product/01-motivation`, heading: /tensor product.*motivation/i },
  { url: `${BASE}/01-tensor-product/02-definition`, heading: /tensor product.*definition/i },
  { url: `${BASE}/01-tensor-product/03-pure-tensor-notation`, heading: /pure tensors and scalar-passing/i },
  { url: `${BASE}/01-tensor-product/04-basis-and-dimension`, heading: /basis of v.*⊗.*w/i },
  { url: `${BASE}/01-tensor-product/05-polynomial-example`, heading: /tensor product example.*two-variable/i },
  { url: `${BASE}/01-tensor-product/06-maps-out-of-tensor`, heading: /defining maps out of v.*⊗.*w/i },
  // Section 2 — Dual space
  { url: `${BASE}/02-dual-space/01-definition`, heading: /dual space.*definition/i },
  { url: `${BASE}/02-dual-space/02-dual-basis`, heading: /the dual basis/i },
  { url: `${BASE}/02-dual-space/03-iso-is-unnatural`, heading: /v.*≅.*v.*is not canonical/i },
  { url: `${BASE}/02-dual-space/04-covectors-as-rows`, heading: /covectors as row vectors/i },
  // Section 3 — Hom as tensor
  { url: `${BASE}/03-hom-as-tensor/01-intuition`, heading: /hom space.*the goal/i },
  { url: `${BASE}/03-hom-as-tensor/02-psi-map`, heading: /from v.*⊗.*w to linear maps/i },
  { url: `${BASE}/03-hom-as-tensor/03-proof-sketch`, heading: /proof of v.*⊗.*w.*hom/i },
  { url: `${BASE}/03-hom-as-tensor/04-concrete-example`, heading: /hom as tensor.*concrete example/i },
  { url: `${BASE}/03-hom-as-tensor/05-hom-vv`, heading: /hom.*v.*k.*is.*v/i },
  // Section 4 — Trace
  { url: `${BASE}/04-trace/01-evaluation-map`, heading: /the evaluation map/i },
  { url: `${BASE}/04-trace/02-trace-definition`, heading: /trace.*intrinsic definition/i },
  { url: `${BASE}/04-trace/03-trace-is-diagonal-sum`, heading: /why trace equals the sum of diagonal/i },
  { url: `${BASE}/04-trace/04-basis-independence`, heading: /trace is basis-independent/i },
  // Section 5 — Problems
  { url: `${BASE}/05-problems/01-standard`, heading: /problems.*standard/i },
  { url: `${BASE}/05-problems/02-daggered`, heading: /problems.*daggered/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Dual space and trace — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Dual space and trace — KaTeX renders', () => {
  test('basis-and-dimension slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-tensor-product/04-basis-and-dimension`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Dual space and trace — MCQ flow (scalar passing)', () => {
  const SLIDE = `${BASE}/01-tensor-product/03-pure-tensor-notation`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#dat-tp-mcq-scalar-pass`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Option (a) "6(e₁ ⊗ f₁)" is correct
    await page.getByRole('button', { name: /6\(e₁ ⊗ f₁\)/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // Option (d) is wrong
    await page.getByRole('button', { name: /It cannot be simplified/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Dual space and trace — NumericInput flow (dim V ⊗ W)', () => {
  const SLIDE = `${BASE}/01-tensor-product/04-basis-and-dimension`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#dat-tp-num-dim`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
    await input.fill('11');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('28');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('28');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Dual space and trace — ProofReveal flow (dim V∨ = dim V)', () => {
  const SLIDE = `${BASE}/02-dual-space/03-iso-is-unnatural`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#dat-ds-proof-dim-vee`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/dual basis e₁∨/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/dual basis e₁∨/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/dual basis e₁∨/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Dual space and trace — Problem flow (trace = sum of eigenvalues)', () => {
  const SLIDE = `${BASE}/05-problems/01-standard`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#dat-prob-trace-eigenvalues`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "Jordan form basis" only appears inside the solution, not the prompt or hint
    await expect(article.getByText(/Jordan form basis/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/Jordan form basis/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
