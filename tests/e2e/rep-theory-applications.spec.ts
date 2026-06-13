import { test, expect } from '@playwright/test';

const BASE = '/part-6-representation-theory/04-applications';

// All slides: [url-suffix, expected heading regex]
const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  // Section 1 — Frobenius divisibility
  { url: `${BASE}/01-frobenius-divisibility/01-the-theorem`, heading: /frobenius divisibility/i },
  { url: `${BASE}/01-frobenius-divisibility/02-group-ring-integral`, heading: /elements of.*are integral/i },
  { url: `${BASE}/01-frobenius-divisibility/03-proof-via-conjugacy-classes`, heading: /proof of frobenius divisibility/i },
  { url: `${BASE}/01-frobenius-divisibility/04-example-and-check`, heading: /frobenius divisibility.*checking/i },
  // Section 2 — Burnside's theorem
  { url: `${BASE}/02-burnsides-theorem/01-the-theorem`, heading: /burnside.*theorem/i },
  { url: `${BASE}/02-burnsides-theorem/02-gcd-lemma`, heading: /gcd.*dim v.*=.*1/i },
  { url: `${BASE}/02-burnsides-theorem/03-no-prime-power-conjugacy`, heading: /simple groups have no prime-power/i },
  { url: `${BASE}/02-burnsides-theorem/04-proof-of-burnside`, heading: /proof of burnside/i },
  // Section 3 — Frobenius determinant
  { url: `${BASE}/03-frobenius-determinant/01-the-matrix`, heading: /group determinant matrix/i },
  { url: `${BASE}/03-frobenius-determinant/02-s3-example`, heading: /group determinant.*s.*3.*example/i },
  { url: `${BASE}/03-frobenius-determinant/03-the-theorem`, heading: /frobenius determinant theorem/i },
  { url: `${BASE}/03-frobenius-determinant/04-proof-setup`, heading: /frobenius determinant.*proof setup/i },
  { url: `${BASE}/03-frobenius-determinant/05-proof-irreducible-distinct`, heading: /irreducibility and distinctness/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

// ── All slides load with correct heading ──────────────────────────────────────
test.describe('Rep-theory applications — all slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

// ── KaTeX renders ─────────────────────────────────────────────────────────────
test.describe('Rep-theory applications — KaTeX renders', () => {
  test('Frobenius divisibility proof slide renders KaTeX math', async ({ page }) => {
    await page.goto(`${BASE}/01-frobenius-divisibility/03-proof-via-conjugacy-classes`);
    await expect(page.locator('.katex').first()).toBeVisible();
  });
});

// ── MCQ flow ──────────────────────────────────────────────────────────────────
test.describe('Rep-theory applications — MCQ flow (dim divides |G|)', () => {
  const SLIDE = `${BASE}/01-frobenius-divisibility/04-example-and-check`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#app-frob-mcq-dim-divides`;

  test('correct answer persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    // 3 divides 15 — this is the correct answer
    await page.getByRole('button', { name: /^3$/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );
    await page.reload();
    await expect(page.getByText('Why:').first()).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    // 4 does not divide 15 — this is wrong
    await page.getByRole('button', { name: /^4$/i }).click();
    await expect(page.getByText('Why:').first()).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

// ── NumericInput flow ─────────────────────────────────────────────────────────
test.describe('Rep-theory applications — NumericInput flow (smallest nonabelian group)', () => {
  const SLIDE = `${BASE}/02-burnsides-theorem/04-proof-of-burnside`;
  const NUM_KEY = `napkin:exercise:${SLIDE}#app-bsd-num-min-order`;

  test('wrong then correct, persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const input = page.getByPlaceholder('a number').first();
    await input.fill('4');
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
test.describe('Rep-theory applications — ProofReveal flow (ℤ[G] integral)', () => {
  const SLIDE = `${BASE}/01-frobenius-divisibility/02-group-ring-integral`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#app-frob-proof-zg-integral`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/monic polynomial of degree/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/monic polynomial of degree/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/ascending chain/i)).toBeVisible();
  });
});
