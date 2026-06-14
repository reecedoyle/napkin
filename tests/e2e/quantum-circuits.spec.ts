import { test, expect } from '@playwright/test';

const BASE = '/part-7-quantum-algorithms/02-quantum-circuits';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Classical logic gates
  { url: `${BASE}/01-classical-logic-gates/01-and-or-not-gates`, heading: /AND, OR, NOT/i },
  { url: `${BASE}/01-classical-logic-gates/02-universality`, heading: /AND, OR, NOT, COPY are universal/i },
  // Section 2 — Reversible classical logic
  { url: `${BASE}/02-reversible-classical-logic/01-why-reversibility`, heading: /why reversibility matters/i },
  { url: `${BASE}/02-reversible-classical-logic/02-cnot-gate`, heading: /the CNOT gate/i },
  { url: `${BASE}/02-reversible-classical-logic/03-cnot-cannot-simulate-and`, heading: /CNOT cannot simulate AND/i },
  { url: `${BASE}/02-reversible-classical-logic/04-toffoli-gate`, heading: /Toffoli gate is universal/i },
  // Section 3 — Quantum logic gates
  { url: `${BASE}/03-quantum-logic-gates/01-unitary-gates`, heading: /Quantum gates are unitary maps/i },
  { url: `${BASE}/03-quantum-logic-gates/02-quantum-cnot`, heading: /quantum CNOT and entanglement/i },
  { url: `${BASE}/03-quantum-logic-gates/03-hadamard-and-rotation-gates`, heading: /Hadamard and rotation gates/i },
  { url: `${BASE}/03-quantum-logic-gates/04-no-cloning`, heading: /no-cloning theorem/i },
  // Section 4 — Deutsch-Jozsa algorithm
  { url: `${BASE}/04-deutsch-jozsa-algorithm/01-the-problem`, heading: /Deutsch-Jozsa problem/i },
  { url: `${BASE}/04-deutsch-jozsa-algorithm/02-the-circuit`, heading: /Deutsch-Jozsa circuit/i },
  { url: `${BASE}/04-deutsch-jozsa-algorithm/03-phase-kickback`, heading: /Phase kickback/i },
  { url: `${BASE}/04-deutsch-jozsa-algorithm/04-measurement-and-conclusion`, heading: /Measurement and conclusion/i },
  // Section 5 — Problems
  { url: `${BASE}/05-problems/01-problems`, heading: /Problems/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Quantum circuits — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Quantum circuits — KaTeX renders', () => {
  test('Toffoli gate slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/02-reversible-classical-logic/04-toffoli-gate`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Quantum circuits — MCQ flow (universality)', () => {
  const SLIDE = `${BASE}/01-classical-logic-gates/02-universality`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#qcirc-clg-mcq-universal`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // OR and NOT are sufficient — correct answer is "c"
    await page.getByRole('button', { name: /OR and NOT/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // NOT alone is wrong
    await page.getByRole('button', { name: /NOT alone/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Quantum circuits — ProofReveal flow (Toffoli simulates NOT)', () => {
  const SLIDE = `${BASE}/02-reversible-classical-logic/04-toffoli-gate`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#qcirc-rev-proof-toffoli-not`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/correct configuration for NOT/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/correct configuration for NOT/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/correct configuration for NOT/i)).toBeVisible();
  });
});

// ── MCQ flow (Deutsch-Jozsa) ──────────────────────────────────────────────────
test.describe('Quantum circuits — MCQ flow (Deutsch-Jozsa measurement)', () => {
  const SLIDE = `${BASE}/04-deutsch-jozsa-algorithm/04-measurement-and-conclusion`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#qcirc-dj-mcq-measurement`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Measuring |0⟩ means f is constant — correct answer is "b"
    await page.getByRole('button', { name: /f is constant/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Quantum circuits — Problem flow (baby no-cloning)', () => {
  const SLIDE = `${BASE}/05-problems/01-problems`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#qcirc-prob-no-clone`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "These two states are different" only appears inside the no-cloning solution text
    await expect(article.getByText(/These two states are different/i)).toBeHidden();

    // Click the second "Show solution" button (no-cloning is the second problem)
    const showSolutionBtns = page.getByRole('button', { name: /show solution/i });
    await showSolutionBtns.nth(1).click();
    await expect(article.getByText(/These two states are different/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
