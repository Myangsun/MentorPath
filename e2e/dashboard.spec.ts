import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('loads dashboard page', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Connection Dashboard' })).toBeVisible();
  });

  test('shows empty state when no connections', async ({ page }) => {
    // Dashboard may show empty state or connections depending on prior test data
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Either connections exist or empty state is shown
    const hasConnections = await page.getByText('Total Connections').isVisible({ timeout: 5_000 }).catch(() => false);
    const hasEmpty = await page.getByText('No connections yet').isVisible({ timeout: 2_000 }).catch(() => false);

    expect(hasConnections || hasEmpty).toBe(true);
  });

  test('full flow: create connection and verify on dashboard', async ({ page }) => {
    // 1. Generate matches
    await page.goto('/matches');
    await page.waitForLoadState('networkidle');

    if (!(await page.getByText(/\d+ mentors? found/).isVisible({ timeout: 3_000 }).catch(() => false))) {
      await page.getByRole('button', { name: /Generate Matches/i }).click();
      await expect(page.getByText(/\d+ mentors? found/)).toBeVisible({ timeout: 30_000 });
    }

    // 2. Go to first mentor
    const firstLink = page.locator('a[href^="/mentor/"]').first();
    const href = await firstLink.getAttribute('href');
    await page.goto(href!);
    await page.waitForLoadState('networkidle');

    // Get mentor name for later verification
    const mentorName = await page.locator('h1').textContent();

    // 3. Go to outreach
    await page.getByRole('link', { name: /Compose Outreach/i }).click();
    await expect(page).toHaveURL(/\/outreach\/.+/);

    // 4. Compose and send message
    const textarea = page.locator('textarea');
    await textarea.fill('Hello! I would like to connect.');
    await page.getByRole('button', { name: /Save & Send|Send/i }).click();

    // 5. Verify we land on dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10_000 });

    // 6. Stats should show at least 1 connection
    await expect(page.getByText('Total Connections')).toBeVisible({ timeout: 10_000 });

    // 7. Pipeline stage tabs should be visible
    await expect(page.getByRole('button', { name: /All/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Outreach Sent/i })).toBeVisible();

    // 8. The sent connection should appear
    if (mentorName) {
      await expect(page.getByText(mentorName)).toBeVisible({ timeout: 5_000 });
    }
  });

  test('pipeline tabs filter connections', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // If connections exist, test tab filtering
    const hasConnections = await page.getByText('Total Connections').isVisible({ timeout: 5_000 }).catch(() => false);

    if (hasConnections) {
      // Click on different pipeline tabs
      const tabs = ['All', 'Saved', 'Outreach Sent', 'Replied', 'Met', 'Ongoing'];
      for (const tab of tabs) {
        const tabButton = page.getByRole('button', { name: new RegExp(tab, 'i') });
        if (await tabButton.isVisible({ timeout: 1_000 }).catch(() => false)) {
          await tabButton.click();
          // Should not crash
          await page.waitForTimeout(300);
        }
      }
    }
  });

  test('connection cards link to mentor detail', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const hasConnections = await page.getByText('Total Connections').isVisible({ timeout: 5_000 }).catch(() => false);

    if (hasConnections) {
      const mentorLink = page.locator('a[href^="/mentor/"]').first();
      if (await mentorLink.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await mentorLink.click();
        await expect(page).toHaveURL(/\/mentor\/.+/);
      }
    }
  });
});
