import { test, expect } from '@playwright/test';

const BASE = '/part-5-more-on-groups/02-sylow';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Sylow theorems
  { url: `${BASE}/01-sylow-theorems/01-the-classification-problem`, heading: /the classification problem/i },
  { url: `${BASE}/01-sylow-theorems/02-sylow-p-subgroup`, heading: /sylow p-subgroups/i },
  { url: `${BASE}/01-sylow-theorems/03-the-three-theorems`, heading: /the three sylow theorems/i },
  { url: `${BASE}/01-sylow-theorems/04-consequences`, heading: /consequences of the sylow theorems/i },
  { url: `${BASE}/01-sylow-theorems/05-triple-prime-product`, heading: /groups of triple prime order/i },
  // Section 2 — Proving Sylow
  { url: `${BASE}/02-proving-sylow/01-group-actions-recap`, heading: /group actions recap/i },
  { url: `${BASE}/02-proving-sylow/02-conjugation-and-normalizer`, heading: /conjugation action and the normalizer/i },
  { url: `${BASE}/02-proving-sylow/03-existence-step`, heading: /step 1.*sylow subgroups exist/i },
  { url: `${BASE}/02-proving-sylow/04-conjugacy-step`, heading: /step 2.*all sylow subgroups are conjugate/i },
  { url: `${BASE}/02-proving-sylow/05-counting-steps`, heading: /steps 3 and 4.*counting/i },
  // Section 3 — Simple groups
  { url: `${BASE}/03-simple-groups/01-simple-groups`, heading: /simple groups$/i },
  { url: `${BASE}/03-simple-groups/02-composition-series`, heading: /composition series/i },
  { url: `${BASE}/03-simple-groups/03-jordan-holder`, heading: /jordan.*h.lder theorem/i },
  { url: `${BASE}/03-simple-groups/04-classification-of-simple-groups`, heading: /classification of finite simple groups/i },
  // Section 4 — Problems
  { url: `${BASE}/04-problems/01-cauchy-and-order-56`, heading: /cauchy.*order 56/i },
  { url: `${BASE}/04-problems/02-word-problem-and-p-group`, heading: /word problem and simple p-groups/i },
  { url: `${BASE}/04-problems/03-s5-faithful-action`, heading: /faithful transitive action of s/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Sylow — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Sylow — KaTeX renders', () => {
  test('three-theorems slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-sylow-theorems/03-the-three-theorems`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Sylow — MCQ flow (consequences, how many Sylow 7-subgroups)', () => {
  const SLIDE = `${BASE}/01-sylow-theorems/04-consequences`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#syl-cons-mcq-normal-sylow`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // Exactly 1 Sylow 7-subgroup is the correct answer
    await page.getByRole('button', { name: /Exactly 1/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // "Exactly 7" is wrong
    await page.getByRole('button', { name: /Exactly 7/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Sylow — NumericInput flow (n₅ for |G|=30)', () => {
  const SLIDE = `${BASE}/01-sylow-theorems/05-triple-prime-product`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#syl-tpp-num-nr-for-30`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByRole('textbox').first();
    await input.fill('1');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText(/not quite/i).first()).toBeVisible();

    await input.fill('6');
    await page.getByRole('button', { name: /^check$/i }).first().click();
    await expect(page.getByText('Correct.').first()).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), NUM_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Correct.').first()).toBeVisible();
    await expect(input).toHaveValue('6');
  });
});

// ── ProofReveal flow ──────────────────────────────────────────────────────────
test.describe('Sylow — ProofReveal flow (nₚ ≡ 1 mod p)', () => {
  const SLIDE = `${BASE}/02-proving-sylow/05-counting-steps`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#syl-proof-np-mod-p`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/Exactly one fixed point/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/Exactly one fixed point/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/Exactly one fixed point/i)).toBeVisible();
  });
});

// ── Problem flow ──────────────────────────────────────────────────────────────
test.describe('Sylow — Problem flow (|G| ≠ 56)', () => {
  const SLIDE = `${BASE}/04-problems/01-cauchy-and-order-56`;
  const PROB_KEY = `napkin:exercise:${SLIDE}#syl-prob-order-56`;

  test('showing solution writes to localStorage', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    // "contradicting simplicity" appears only inside the solution text
    await expect(article.getByText(/contradicting simplicity/i)).toBeHidden();

    // The order-56 Problem is the 2nd on this slide (Cauchy's theorem is 1st).
    await page.getByRole('button', { name: /show solution/i }).nth(1).click();
    await expect(article.getByText(/contradicting simplicity/i)).toBeVisible();

    const stored = await page.evaluate((k) => window.localStorage.getItem(k), PROB_KEY);
    expect(stored).not.toBeNull();
  });
});
