import { test, expect } from '@playwright/test';

test.describe('slide navigation (prev/next)', () => {
  test('first slide of §1 has Next but no Previous', async ({ page }) => {
    await page.goto('/part-1-starting-out/01-groups/01-definition/01-what-is-a-group');
    const nav = page.getByRole('navigation', { name: 'Slide navigation' });
    await expect(nav).toBeVisible();
    // No Previous link.
    await expect(nav.locator('a[rel="prev"]')).toHaveCount(0);
    // Next link exists and points to slide 02.
    const next = nav.locator('a[rel="next"]');
    await expect(next).toBeVisible();
    await expect(next).toHaveAttribute(
      'href',
      '/part-1-starting-out/01-groups/01-definition/02-additive-integers',
    );
  });

  test('a middle slide has both Previous and Next; both work', async ({ page }) => {
    await page.goto('/part-1-starting-out/01-groups/01-definition/04-formal-definition');
    const nav = page.getByRole('navigation', { name: 'Slide navigation' });

    const prev = nav.locator('a[rel="prev"]');
    const next = nav.locator('a[rel="next"]');
    await expect(prev).toBeVisible();
    await expect(next).toBeVisible();

    // Click Next, then Previous, and end up where we started.
    await next.click();
    await expect(page).toHaveURL(
      /\/01-definition\/05-non-examples\/?$/,
    );
    await page.getByRole('navigation', { name: 'Slide navigation' }).locator('a[rel="prev"]').click();
    await expect(page).toHaveURL(
      /\/01-definition\/04-formal-definition\/?$/,
    );
  });

  test('navigation crosses section boundaries', async ({ page }) => {
    // Last slide of §1 should link Next to the first slide of §2.
    await page.goto('/part-1-starting-out/01-groups/01-definition/10-which-are-groups');
    const next = page.getByRole('navigation', { name: 'Slide navigation' }).locator('a[rel="next"]');
    await expect(next).toHaveAttribute('href', /02-properties\/01-/);
  });

  test('smoke-test slide (chapter root) does NOT show nav', async ({ page }) => {
    await page.goto('/part-1-starting-out/01-groups/01-hello');
    await expect(
      page.getByRole('navigation', { name: 'Slide navigation' }),
    ).toHaveCount(0);
  });

  test('home page does NOT show nav', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('navigation', { name: 'Slide navigation' }),
    ).toHaveCount(0);
  });
});

test.describe('keyboard navigation', () => {
  test('ArrowRight goes to next slide; ArrowLeft goes back', async ({ page }) => {
    await page.goto('/part-1-starting-out/01-groups/01-definition/04-formal-definition');

    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/\/01-definition\/05-non-examples\/?$/);

    await page.keyboard.press('ArrowLeft');
    await expect(page).toHaveURL(/\/01-definition\/04-formal-definition\/?$/);
  });

  test('ArrowLeft on the first slide does nothing', async ({ page }) => {
    await page.goto('/part-1-starting-out/01-groups/01-definition/01-what-is-a-group');
    const url = page.url();
    await page.keyboard.press('ArrowLeft');
    // Stays on the same page.
    await expect(page).toHaveURL(url);
  });

  test('ArrowRight while typing in NumericInput does NOT navigate', async ({ page }) => {
    await page.goto('/part-1-starting-out/01-groups/04-orders-and-lagrange/01-order-of-a-group');
    const url = page.url();
    const input = page.getByRole('textbox').first();
    await input.click();
    await input.fill('42');
    await page.keyboard.press('ArrowRight');
    // Cursor moved within input; URL unchanged.
    await expect(page).toHaveURL(url);
  });

  test('Cmd/Ctrl+ArrowRight does NOT navigate (reserved for browser shortcuts)', async ({ page }) => {
    await page.goto('/part-1-starting-out/01-groups/01-definition/04-formal-definition');
    const url = page.url();
    // Use Control on all platforms — Playwright maps Meta to Cmd only on macOS.
    await page.keyboard.press('Control+ArrowRight');
    await expect(page).toHaveURL(url);
  });
});
