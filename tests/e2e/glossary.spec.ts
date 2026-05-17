import { test, expect } from '@playwright/test';

test.describe('glossary page', () => {
  test('lists notation entries with anchors', async ({ page }) => {
    await page.goto('/glossary');
    await expect(page.getByRole('heading', { name: 'Glossary' })).toBeVisible();

    // A handful of expected entries should be present.
    for (const key of ['ZZ', 'Zc', 'Sn', 'Dn', 'GLn', 'isomorphic']) {
      await expect(page.locator(`#${key}`)).toBeVisible();
    }
  });

  test('an anchor link from another page scrolls to the right entry', async ({ page }) => {
    await page.goto('/glossary#Sn');
    // Browser scrolls; the targeted entry has a :target style with a different
    // border-left colour. We don't assert the exact colour, just that the
    // entry is in view (its bounding box is within the viewport).
    const entry = page.locator('#Sn');
    await expect(entry).toBeVisible();
    await expect(entry).toBeInViewport();
  });
});
