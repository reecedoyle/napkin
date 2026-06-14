import { test, expect } from '@playwright/test';

const BASE = '/part-7-quantum-algorithms/03-shors-algorithm';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Classical (inverse) Fourier transform
  { url: `${BASE}/01-classical-fourier-transform/01-why-fourier`, heading: /why fourier/i },
  { url: `${BASE}/01-classical-fourier-transform/02-roots-of-unity`, heading: /roots of unity/i },
  { url: `${BASE}/01-classical-fourier-transform/03-dift-definition`, heading: /discrete inverse fourier transform/i },
  { url: `${BASE}/01-classical-fourier-transform/04-periodicity-detection`, heading: /why dift detects periodicity/i },
  { url: `${BASE}/01-classical-fourier-transform/05-worked-example`, heading: /worked example/i },
  { url: `${BASE}/01-classical-fourier-transform/06-naming-remark`, heading: /naming quirk/i },
  { url: `${BASE}/01-classical-fourier-transform/07-complexity-bottleneck`, heading: /complexity bottleneck/i },
  // Section 2 — Quantum Fourier transform
  { url: `${BASE}/02-quantum-fourier-transform/01-qubits-and-basis`, heading: /qubits and computational basis/i },
  { url: `${BASE}/02-quantum-fourier-transform/02-qft-definition`, heading: /definition of the qft/i },
  { url: `${BASE}/02-quantum-fourier-transform/03-tensor-representation`, heading: /tensor product representation/i },
  { url: `${BASE}/02-quantum-fourier-transform/04-rotation-gates`, heading: /rotation gates/i },
  { url: `${BASE}/02-quantum-fourier-transform/05-circuit-n3`, heading: /qft circuit for n = 3/i },
  { url: `${BASE}/02-quantum-fourier-transform/06-general-circuit`, heading: /general qft circuit/i },
  { url: `${BASE}/02-quantum-fourier-transform/07-why-quantum-wins`, heading: /why the quantum version wins/i },
  // Section 3 — Shor's algorithm
  { url: `${BASE}/03-shors-algorithm/01-factoring-to-order-finding`, heading: /factoring reduces to order-finding/i },
  { url: `${BASE}/03-shors-algorithm/02-good-residues`, heading: /good residues/i },
  { url: `${BASE}/03-shors-algorithm/03-order-is-period`, heading: /order-finding is period-finding/i },
  { url: `${BASE}/03-shors-algorithm/04-generating-periodic-state`, heading: /generating the periodic state/i },
  { url: `${BASE}/03-shors-algorithm/05-collapse-by-measurement`, heading: /collapsing to a periodic superposition/i },
  { url: `${BASE}/03-shors-algorithm/06-applying-qft`, heading: /destructive interference/i },
  { url: `${BASE}/03-shors-algorithm/07-continued-fractions`, heading: /continued fractions/i },
  { url: `${BASE}/03-shors-algorithm/08-success-probability`, heading: /success probability/i },
  { url: `${BASE}/03-shors-algorithm/09-modular-exponentiation`, heading: /bottleneck/i },
  { url: `${BASE}/03-shors-algorithm/10-full-algorithm`, heading: /complete picture/i },
  { url: `${BASE}/03-shors-algorithm/11-why-it-matters`, heading: /cryptographic implications/i },
  { url: `${BASE}/03-shors-algorithm/12-summary`, heading: /pieces fit together/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe("Shor's algorithm — all slide URLs load", () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe("Shor's algorithm — KaTeX renders", () => {
  test('QFT definition slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-quantum-fourier-transform/02-qft-definition`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe("Shor's algorithm — MCQ flow (FFT cost)", () => {
  const SLIDE = `${BASE}/01-classical-fourier-transform/07-complexity-bottleneck`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#shor-dft-mcq-fft-cost`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Correct answer: O(2ⁿ · n) — still exponential in n
    await page.getByRole('button', { name: /O\(2ⁿ · n\) — still exponential in n/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // O(n²) is wrong — that's the QFT, not the FFT
    await page.getByRole('button', { name: /O\(n²\) — polynomial in n/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe("Shor's algorithm — NumericInput flow (gate count for n=10)", () => {
  const SLIDE = `${BASE}/02-quantum-fourier-transform/07-why-quantum-wins`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#shor-qft-num-gates-n10`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('45');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('55');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('55');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe("Shor's algorithm — ProofReveal flow (QFT circuit n=3)", () => {
  const SLIDE = `${BASE}/02-quantum-fourier-transform/05-circuit-n3`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#shor-qft-proof-n3-output`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Start with/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Start with/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Start with/i)).toBeVisible();
  });
});
