import { test, expect } from '@playwright/test';

const BASE = '/part-6-representation-theory/03-characters';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Definitions
  { url: `${BASE}/01-definitions/01-what-is-a-character`, heading: /what is a character/i },
  { url: `${BASE}/01-definitions/02-character-table-s3`, heading: /character table of s₃/i },
  { url: `${BASE}/01-definitions/03-four-mysteries`, heading: /four mysterious properties/i },
  // Section 2 — Dual space modulo commutator
  { url: `${BASE}/02-dual-space-commutator/01-trace-commutativity`, heading: /trace commutativity/i },
  { url: `${BASE}/02-dual-space-commutator/02-abelianization`, heading: /abelianization of an algebra/i },
  { url: `${BASE}/02-dual-space-commutator/03-abelianization-warning`, heading: /abelianization.*warning/i },
  { url: `${BASE}/02-dual-space-commutator/04-character-theorem`, heading: /character theorem for algebras/i },
  // Section 3 — Orthogonality
  { url: `${BASE}/03-orthogonality/01-inner-product-setup`, heading: /inner product on class functions/i },
  { url: `${BASE}/03-orthogonality/02-dual-representation`, heading: /dual representation/i },
  { url: `${BASE}/03-orthogonality/03-tensor-product-rep`, heading: /tensor product of representations/i },
  { url: `${BASE}/03-orthogonality/04-character-trace-formulas`, heading: /character trace formulas/i },
  { url: `${BASE}/03-orthogonality/05-orthogonality-theorem`, heading: /orthogonality theorem/i },
  { url: `${BASE}/03-orthogonality/06-orthogonality-proof`, heading: /proof of orthogonality/i },
  { url: `${BASE}/03-orthogonality/07-irreducibility-check`, heading: /testing irreducibility/i },
  // Section 4 — Examples
  { url: `${BASE}/04-examples/01-dihedral-setup`, heading: /character table of d₁₀ — setup/i },
  { url: `${BASE}/04-examples/02-dihedral-table`, heading: /character table of d₁₀ — the table/i },
  { url: `${BASE}/04-examples/03-s4-setup`, heading: /character table of s₄ — setup/i },
  { url: `${BASE}/04-examples/04-s4-table`, heading: /character table of s₄ — the full table/i },
  // Section 5 — Problems
  { url: `${BASE}/05-problems/01-standard-and-daggered`, heading: /problems.*decompositions/i },
  { url: `${BASE}/05-problems/02-starred`, heading: /problems.*starred/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Characters — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Characters — KaTeX renders', () => {
  test('orthogonality proof slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-orthogonality/06-orthogonality-proof`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Characters — MCQ flow (dimension readout)', () => {
  const SLIDE = `${BASE}/01-definitions/03-four-mysteries`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#chr-def-mcq-dimension`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // "dim V" is the correct answer (option c)
    await page.getByRole('button', { name: /dim V/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // Clicking option "a" (value 1) is wrong
    await page.getByRole('button', { name: /^1$/ }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Characters — NumericInput flow (norm of trivial character)', () => {
  const SLIDE = `${BASE}/03-orthogonality/07-irreducibility-check`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#chr-orth-num-norm-s3triv`;

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
test.describe('Characters — ProofReveal flow (character theorem part b)', () => {
  const SLIDE = `${BASE}/02-dual-space-commutator/04-character-theorem`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#chr-comm-proof-part-b`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/By semisimplicity/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/By semisimplicity/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/By semisimplicity/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Characters — Problem flow (decomposition theorem)', () => {
  const SLIDE = `${BASE}/05-problems/01-standard-and-daggered`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#chr-prob-decomposition`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "By orthonormality of irreducible characters" only appears inside the solution
    await expect(article.getByText(/By orthonormality of irreducible characters/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/By orthonormality of irreducible characters/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
