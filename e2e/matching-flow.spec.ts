import { test, expect } from '@playwright/test';

test.describe('Matching Flow', () => {
  test('loads matches page with heading', async ({ page }) => {
    await page.goto('/matches');
    await expect(page.getByRole('heading', { name: 'Discover Mentors' })).toBeVisible();
  });

  test('generates matches and displays results', async ({ page }) => {
    await page.goto('/matches');

    // Click generate
    await page.getByRole('button', { name: /Generate Matches/i }).click();

    // Wait for match cards to appear (API takes a moment with mock)
    await expect(page.getByText(/\d+ mentors? found/)).toBeVisible({ timeout: 30_000 });

    // At least one match card should be visible with a percentage score
    await expect(page.getByText(/%/).first()).toBeVisible();
  });

  test('displays match cards with alumni info', async ({ page }) => {
    // Navigate to matches — cached results should load
    await page.goto('/matches');

    // Wait for the page to finish loading (either cached matches or empty state)
    await page.waitForLoadState('networkidle');

    // If no cached matches, generate them
    const matchCount = page.getByText(/\d+ mentors? found/);
    if (!(await matchCount.isVisible({ timeout: 3_000 }).catch(() => false))) {
      await page.getByRole('button', { name: /Generate Matches/i }).click();
      await expect(matchCount).toBeVisible({ timeout: 30_000 });
    }

    // Match cards should have alumni name links
    const links = page.locator('a[href^="/mentor/"]');
    await expect(links.first()).toBeVisible({ timeout: 10_000 });
  });

  test('filters by minimum score', async ({ page }) => {
    await page.goto('/matches');
    await page.waitForLoadState('networkidle');

    // Generate if needed
    const matchCount = page.getByText(/\d+ mentors? found/);
    if (!(await matchCount.isVisible({ timeout: 3_000 }).catch(() => false))) {
      await page.getByRole('button', { name: /Generate Matches/i }).click();
      await expect(matchCount).toBeVisible({ timeout: 30_000 });
    }

    // Get initial count text
    const initialText = await matchCount.textContent();
    const initialCount = parseInt(initialText?.match(/(\d+)/)?.[1] || '0');

    // If there are matches, the filter panel should be visible on desktop
    if (initialCount > 0) {
      // Check filter panel exists
      await expect(page.getByText('Minimum Score')).toBeVisible();
    }
  });

  test('clicking a match card navigates to mentor detail', async ({ page }) => {
    await page.goto('/matches');
    await page.waitForLoadState('networkidle');

    // Generate if needed
    if (!(await page.getByText(/\d+ mentors? found/).isVisible({ timeout: 3_000 }).catch(() => false))) {
      await page.getByRole('button', { name: /Generate Matches/i }).click();
      await expect(page.getByText(/\d+ mentors? found/)).toBeVisible({ timeout: 30_000 });
    }

    // Click first match card link
    const firstLink = page.locator('a[href^="/mentor/"]').first();
    await firstLink.click();

    // Should navigate to mentor detail page
    await expect(page).toHaveURL(/\/mentor\/.+/);
    await expect(page.getByText('Back to matches')).toBeVisible();
  });
});
