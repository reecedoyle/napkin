import { test, expect } from '@playwright/test';

const BASE = '/part-7-quantum-algorithms/01-quantum-states';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Bra-ket notation
  { url: `${BASE}/01-bra-ket-notation/01-from-vectors-to-kets`, heading: /from vectors to kets/i },
  { url: `${BASE}/01-bra-ket-notation/02-bras-and-inner-product`, heading: /bras and the inner product/i },
  { url: `${BASE}/01-bra-ket-notation/03-finite-dimensional-hilbert-spaces`, heading: /finite-dimensional hilbert spaces/i },
  // Section 2 — The state space
  { url: `${BASE}/02-the-state-space/01-classical-vs-quantum-bits`, heading: /classical vs quantum bits/i },
  { url: `${BASE}/02-the-state-space/02-normalisation`, heading: /normalisation/i },
  { url: `${BASE}/02-the-state-space/03-n-qubit-systems`, heading: /n-qubit systems/i },
  // Section 3 — Observations
  { url: `${BASE}/03-observations/01-hermitian-operators`, heading: /hermitian operators as observables/i },
  { url: `${BASE}/03-observations/02-born-rule`, heading: /the born rule/i },
  { url: `${BASE}/03-observations/03-quantum-collapse`, heading: /quantum collapse/i },
  { url: `${BASE}/03-observations/04-measurement-example`, heading: /measurement example/i },
  { url: `${BASE}/03-observations/05-pauli-matrices`, heading: /pauli matrices/i },
  { url: `${BASE}/03-observations/06-distinguishing-states`, heading: /distinguishing states by measurement/i },
  // Section 4 — Entanglement
  { url: `${BASE}/04-entanglement/01-tensor-products-of-qubits`, heading: /tensor products of qubits/i },
  { url: `${BASE}/04-entanglement/02-measuring-one-qubit`, heading: /measuring one qubit at a time/i },
  { url: `${BASE}/04-entanglement/03-non-entangled-example`, heading: /non-entangled two-qubit example/i },
  { url: `${BASE}/04-entanglement/04-the-singlet-state`, heading: /the singlet state/i },
  { url: `${BASE}/04-entanglement/05-spooky-action`, heading: /spooky action at a distance/i },
  { url: `${BASE}/04-entanglement/06-simultaneous-measurement`, heading: /simultaneous measurement of two qubits/i },
  // Section 5 — Problems
  { url: `${BASE}/05-problems/01-singlet-x-measurement`, heading: /measuring the singlet state along/i },
  { url: `${BASE}/05-problems/02-ghz-paradox`, heading: /greenberger.*horne.*zeilinger paradox/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Quantum states — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Quantum states — KaTeX renders', () => {
  test('born-rule slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/03-observations/02-born-rule`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow — bra of ket ─────────────────────────────────────────────────────
test.describe('Quantum states — MCQ flow (bra of a ket)', () => {
  const SLIDE = `${BASE}/01-bra-ket-notation/03-finite-dimensional-hilbert-spaces`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#qs-bk-mcq-bra-of-ket`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Option c is correct — conjugate transpose of the column
    await page.getByRole('button', { name: /conjugate transpose of the column/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // Option a is wrong — it's the same row vector, not conjugated
    await page.getByRole('button', { name: /the same row vector/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow — normalisation ─────────────────────────────────────────
test.describe('Quantum states — NumericInput flow (normalisation check)', () => {
  const SLIDE = `${BASE}/02-the-state-space/02-normalisation`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#qs-ss-num-normalise`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
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

// ── ProofReveal flow — repeat measurement ─────────────────────────────────────
test.describe('Quantum states — ProofReveal flow (repeat measurement)', () => {
  const SLIDE = `${BASE}/03-observations/06-distinguishing-states`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#qs-obs-proof-repeat-measure`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/collapsed state is itself an eigenstate/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/collapsed state is itself an eigenstate/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/collapsed state is itself an eigenstate/i)).toBeVisible();
  });
});

// ── Problem flow — singlet x-measurement ─────────────────────────────────────
test.describe('Quantum states — Problem flow (singlet x-measurement)', () => {
  const SLIDE = `${BASE}/05-problems/01-singlet-x-measurement`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#qs-prob-singlet-x`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "spooky correlation" only appears inside the solution text
    await expect(article.getByText(/spooky correlation/i)).toBeHidden();

    await page.getByRole('button', { name: /show solution/i }).first().click();
    await expect(article.getByText(/spooky correlation/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
