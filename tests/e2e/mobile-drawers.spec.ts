import { test, expect } from '@playwright/test';

// Test mobile-viewport behavior. Default Playwright "Desktop Chrome" is 1280×720
// where the TOC is already in drawer mode (threshold 1320) but the glossary
// is still a fixed sidebar (threshold 1140). To exercise the glossary drawer
// path too, we shrink the viewport for this file.
test.use({ viewport: { width: 412, height: 915 } }); // typical phone

const SLIDE = '/part-1-starting-out/01-groups/01-definition/04-formal-definition';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
});

test.describe('mobile · TOC drawer', () => {
  test('opens via toggle, closes via backdrop, closes via ESC', async ({ page }) => {
    await page.goto(SLIDE);

    const toc = page.locator('#napkin-drawer-toc');
    const backdrop = page.locator('[data-backdrop]');

    // Starts closed.
    await expect(toc).toHaveAttribute('data-open', 'false');
    await expect(backdrop).toHaveAttribute('data-open', 'false');

    // Toggle button is the "Show table of contents" one.
    await page.getByRole('button', { name: /show table of contents/i }).click();
    await expect(toc).toHaveAttribute('data-open', 'true');
    await expect(backdrop).toHaveAttribute('data-open', 'true');

    // Backdrop click closes. TOC drawer covers the left 80vw, so a real user
    // taps the visible strip on the right — click at x = viewport - 10.
    await backdrop.click({ position: { x: 402, y: 500 } });
    await expect(toc).toHaveAttribute('data-open', 'false');

    // Re-open and ESC closes.
    await page.getByRole('button', { name: /show table of contents/i }).click();
    await expect(toc).toHaveAttribute('data-open', 'true');
    await page.keyboard.press('Escape');
    await expect(toc).toHaveAttribute('data-open', 'false');
  });

  test('tapping a TOC link navigates and closes the drawer', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('button', { name: /show table of contents/i }).click();

    // The TOC lists every slide in chapter 1. Pick the very first one.
    const firstLink = page.locator('#napkin-drawer-toc a').first();
    await firstLink.click();

    await expect(page).toHaveURL(/01-what-is-a-group/);
    await expect(page.locator('#napkin-drawer-toc')).toHaveAttribute('data-open', 'false');
  });
});

test.describe('mobile · Glossary drawer', () => {
  test('opens via toggle and closes via backdrop', async ({ page }) => {
    await page.goto(SLIDE);

    const drawer = page.locator('#napkin-drawer-glossary');
    const backdrop = page.locator('[data-backdrop]');

    await expect(drawer).toHaveAttribute('data-open', 'false');

    await page.getByRole('button', { name: /show glossary/i }).click();
    await expect(drawer).toHaveAttribute('data-open', 'true');
    await expect(backdrop).toHaveAttribute('data-open', 'true');

    // Glossary drawer slides in from the right (85vw); the visible strip
    // is on the left, so click near x = 10.
    await backdrop.click({ position: { x: 10, y: 500 } });
    await expect(drawer).toHaveAttribute('data-open', 'false');
  });

  test('tapping a Term marker on a slide opens the glossary drawer and scrolls to the entry', async ({ page }) => {
    await page.goto(SLIDE);

    // Term anchors are inline within KaTeX-rendered math; Playwright's
    // coordinate-based click ends up on a sibling element. Dispatch the
    // click event directly so it bubbles to the document handler —
    // we're verifying the JS handler responds, not the layout's tap target.
    const term = page.locator('main .napkin-term').first();
    const termKey = await term.getAttribute('data-term-key');
    await term.dispatchEvent('click');

    await expect(page.locator('#napkin-drawer-glossary')).toHaveAttribute('data-open', 'true');
    // The targeted entry should be in view inside the drawer.
    const entry = page.locator(`#g-${termKey}`);
    await expect(entry).toBeInViewport();
  });
});

test.describe('mobile · header home link', () => {
  test('"Napkin" home link in header returns to the home page', async ({ page }) => {
    await page.goto(SLIDE);
    await page.getByRole('link', { name: /home.*chapters|napkin/i }).first().click();
    await expect(page).toHaveURL(/\/?$/);
    await expect(page.getByRole('heading', { name: 'An Infinitely Large Napkin' })).toBeVisible();
  });
});

test.describe('mobile · backdrop is interactive only when a drawer is open', () => {
  test('backdrop is not clickable when no drawer is open', async ({ page }) => {
    await page.goto(SLIDE);
    const backdrop = page.locator('[data-backdrop]');
    // It exists but is non-interactive.
    await expect(backdrop).toHaveAttribute('data-open', 'false');
    // Pointer-events: none means a click at backdrop's location passes through
    // to whatever is below. We can verify by attempting to interact with the
    // page underneath — the heading is still clickable.
    await page.getByRole('heading', { level: 1 }).click(); // no error, no nav
  });
});
