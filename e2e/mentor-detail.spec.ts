import { test, expect } from '@playwright/test';

test.describe('Mentor Detail', () => {
  // Helper to ensure matches exist, then navigate to first mentor
  async function navigateToFirstMentor(page: import('@playwright/test').Page) {
    await page.goto('/matches');
    await page.waitForLoadState('networkidle');

    // Generate matches if needed
    if (!(await page.getByText(/\d+ mentors? found/).isVisible({ timeout: 3_000 }).catch(() => false))) {
      await page.getByRole('button', { name: /Generate Matches/i }).click();
      await expect(page.getByText(/\d+ mentors? found/)).toBeVisible({ timeout: 30_000 });
    }

    // Click first mentor link
    const firstLink = page.locator('a[href^="/mentor/"]').first();
    const href = await firstLink.getAttribute('href');
    await page.goto(href!);
    await page.waitForLoadState('networkidle');
  }

  test('displays mentor profile information', async ({ page }) => {
    await navigateToFirstMentor(page);

    // Should show mentor name (h1)
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    // Should show "Back to matches" link
    await expect(page.getByText('Back to matches')).toBeVisible();
  });

  test('shows match breakdown with score bars', async ({ page }) => {
    await navigateToFirstMentor(page);

    // Match Breakdown section should be visible
    await expect(page.getByText('Match Breakdown')).toBeVisible();

    // Score categories should be present
    await expect(page.getByText('Career Pivot')).toBeVisible();
    await expect(page.getByText('Academic')).toBeVisible();
    await expect(page.getByText('Industry')).toBeVisible();
  });

  test('shows Compose Outreach button', async ({ page }) => {
    await navigateToFirstMentor(page);

    const outreachButton = page.getByRole('link', { name: /Compose Outreach/i });
    await expect(outreachButton).toBeVisible();
    await expect(outreachButton).toHaveAttribute('href', /\/outreach\/.+/);
  });

  test('can expand detailed rationale', async ({ page }) => {
    await navigateToFirstMentor(page);

    // Click to expand detailed analysis
    const expandButton = page.getByRole('button', { name: /See Detailed Analysis/i });
    if (await expandButton.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await expandButton.click();

      // Wait for analysis to load (mock mode returns instantly)
      await expect(
        page.getByRole('button', { name: /Hide Details/i })
      ).toBeVisible({ timeout: 15_000 });
    }
  });

  test('shows career timeline when available', async ({ page }) => {
    await navigateToFirstMentor(page);

    // Career Timeline section (may or may not exist depending on mentor data)
    const timeline = page.getByText('Career Timeline');
    if (await timeline.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await expect(timeline).toBeVisible();
    }
  });

  test('shows conversation starters', async ({ page }) => {
    await navigateToFirstMentor(page);

    await expect(page.getByText('Conversation Starters')).toBeVisible();
  });

  test('back link returns to matches page', async ({ page }) => {
    await navigateToFirstMentor(page);

    await page.getByText('Back to matches').click();
    await expect(page).toHaveURL('/matches');
  });

  test('returns 404 for invalid mentor ID', async ({ page }) => {
    await page.goto('/mentor/nonexistent-id-12345');
    await page.waitForLoadState('networkidle');

    // Should show error / not found state
    await expect(page.getByText(/not found|error/i)).toBeVisible({ timeout: 5_000 });
  });
});
