import { test, expect } from '@playwright/test';

const BASE = '/part-1-starting-out/01-groups/03-isomorphisms';

const SLIDES: Array<{ url: string; heading: RegExp | string }> = [
  { url: `${BASE}/01-renaming-elements`, heading: /When two groups are .the same./i },
  { url: `${BASE}/02-formal-definition`, heading: /definition of an isomorphism/i },
  { url: `${BASE}/03-easy-examples`, heading: /First examples of isomorphisms/i },
  { url: `${BASE}/04-primitive-roots-mod-7`, heading: /nontrivial example/i },
  { url: `${BASE}/05-primitive-roots-general`, heading: /Primitive roots in general/i },
  { url: `${BASE}/06-equivalence-and-up-to-iso`, heading: /Isomorphism is an equivalence relation/i },
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('Groups · Isomorphisms section — slide URLs load', () => {
  for (const slide of SLIDES) {
    test(`loads ${slide.url} and shows heading`, async ({ page }) => {
      const resp = await page.goto(slide.url);
      expect(resp?.status()).toBe(200);
      await expect(page.getByRole('heading', { level: 1, name: slide.heading })).toBeVisible();
    });
  }
});

test.describe('Groups · Isomorphisms section — KaTeX renders', () => {
  test('primitive-roots-mod-7 slide renders display math', async ({ page }) => {
    await page.goto(`${BASE}/04-primitive-roots-mod-7`);
    await expect(page.locator('.katex-display').first()).toBeVisible();
  });
});

test.describe('Groups · Isomorphisms — MCQ flow (respects operation)', () => {
  const SLIDE = `${BASE}/02-formal-definition`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#grp-iso-mcq-respects-operation`;

  test('correct answer is recorded and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);
    await page
      .getByRole('button', { name: /φ\(g₁ ⋆ g₂\) = φ\(g₁\) ∗ φ\(g₂\), where ⋆ is G's operation/i })
      .click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:')).toBeVisible();
  });

  test('wrong answer is recorded as incorrect', async ({ page }) => {
    await page.goto(SLIDE);
    await page
      .getByRole('button', { name: /so the image is abelian/i })
      .click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"incorrect"',
    );
  });
});

test.describe('Groups · Isomorphisms — MCQ flow (up to isomorphism)', () => {
  const SLIDE = `${BASE}/06-equivalence-and-up-to-iso`;
  const MCQ_KEY = `napkin:exercise:${SLIDE}#grp-iso-mcq-up-to-iso`;

  test('correct "up to isomorphism" answer persists', async ({ page }) => {
    await page.goto(SLIDE);
    await page
      .getByRole('button', { name: /one representative from each isomorphism class/i })
      .click();

    await expect(page.getByText('Why:')).toBeVisible();
    expect(await page.evaluate((k) => window.localStorage.getItem(k), MCQ_KEY)).toContain(
      '"outcome":"correct"',
    );

    await page.reload();
    await expect(page.getByText('Why:')).toBeVisible();
  });
});

test.describe('Groups · Isomorphisms — ProofReveal flow (primitive roots)', () => {
  const SLIDE = `${BASE}/05-primitive-roots-general`;
  const PROOF_KEY = `napkin:exercise:${SLIDE}#grp-iso-proof-primitive-roots`;

  test('reveal shows solution and persists across reload', async ({ page }) => {
    await page.goto(SLIDE);

    const article = page.getByRole('article');
    await expect(article.getByText(/by the defining property of a primitive root/i)).toBeHidden();

    await page.getByRole('button', { name: /reveal solution/i }).click();
    await expect(article.getByText(/by the defining property of a primitive root/i)).toBeVisible();

    expect(await page.evaluate((k) => window.localStorage.getItem(k), PROOF_KEY)).toContain(
      '"outcome":"revealed"',
    );

    await page.reload();
    await expect(article.getByText(/by the defining property of a primitive root/i)).toBeVisible();
  });
});
