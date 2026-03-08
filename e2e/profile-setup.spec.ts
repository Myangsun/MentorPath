import { test, expect } from '@playwright/test';

test.describe('Profile Setup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
    // Wait for profile data to load
    await expect(page.locator('#name')).toBeVisible({ timeout: 10_000 });
  });

  test('loads the profile page with form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Your Profile' })).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#school')).toBeVisible();
    await expect(page.locator('#major')).toBeVisible();
    await expect(page.locator('#graduationYear')).toBeVisible();
  });

  test('displays completion bar', async ({ page }) => {
    // CompletionBar renders "Profile Completion" label and a percentage
    await expect(page.getByText('Profile Completion')).toBeVisible();
    await expect(page.getByText(/%/)).toBeVisible();
  });

  test('can fill in basic information', async ({ page }) => {
    await page.locator('#name').fill('Test Student');
    await page.locator('#school').selectOption('MIT - Massachusetts Institute of Technology');
    await page.locator('#major').selectOption('Computer Science');
    await page.locator('#graduationYear').fill('2026');
    await page.locator('#visaStatus').selectOption('F-1');

    // Verify fields have correct values
    await expect(page.locator('#name')).toHaveValue('Test Student');
    await expect(page.locator('#school')).toHaveValue('MIT - Massachusetts Institute of Technology');
    await expect(page.locator('#major')).toHaveValue('Computer Science');
  });

  test('can toggle target industries', async ({ page }) => {
    // "Nonprofit" is unique to the industries section (not in roles)
    const nonprofitButton = page.getByRole('button', { name: 'Nonprofit', exact: true });

    // Get current state
    const classBefore = await nonprofitButton.getAttribute('class');
    const wasSelected = classBefore?.includes('bg-brand-50');

    // Click to toggle
    await nonprofitButton.click();

    // State should flip
    if (wasSelected) {
      await expect(nonprofitButton).not.toHaveClass(/bg-brand-50/);
    } else {
      await expect(nonprofitButton).toHaveClass(/bg-brand-50/);
    }
  });

  test('can toggle target roles', async ({ page }) => {
    const marketingButton = page.getByRole('button', { name: 'Marketing', exact: true });

    const classBefore = await marketingButton.getAttribute('class');
    const wasSelected = classBefore?.includes('bg-brand-50');

    await marketingButton.click();

    if (wasSelected) {
      await expect(marketingButton).not.toHaveClass(/bg-brand-50/);
    } else {
      await expect(marketingButton).toHaveClass(/bg-brand-50/);
    }
  });

  test('can add and remove prior roles', async ({ page }) => {
    // Add a new role
    await page.getByRole('button', { name: 'Add Role' }).click();

    // A new role section should appear with a "Job title" placeholder
    const titleInputs = page.getByPlaceholder('Job title');
    const count = await titleInputs.count();
    expect(count).toBeGreaterThan(0);

    // Fill the last (newly added) role
    await titleInputs.last().fill('Software Engineer');
    await expect(titleInputs.last()).toHaveValue('Software Engineer');

    // Remove the last role using its remove button
    const removeButtons = page.getByRole('button', { name: /Remove role/i });
    const removeCount = await removeButtons.count();
    await removeButtons.last().click();

    // Should have one fewer role now
    const newRemoveCount = await page.getByRole('button', { name: /Remove role/i }).count();
    expect(newRemoveCount).toBe(removeCount - 1);
  });

  test('can save profile', async ({ page }) => {
    await page.locator('#name').fill('E2E Test User');
    await page.locator('#school').selectOption('Harvard University');
    await page.locator('#major').selectOption('Economics');

    // Save
    await page.getByRole('button', { name: /Save Profile/i }).click();

    // Wait for success
    await expect(page.getByText('Profile saved successfully!')).toBeVisible({ timeout: 10_000 });
  });

  test('persists saved data on reload', async ({ page }) => {
    // Fill and save
    await page.locator('#name').fill('Persistent User');
    await page.locator('#school').selectOption('Stanford University');
    await page.locator('#major').selectOption('Data Science');
    await page.getByRole('button', { name: /Save Profile/i }).click();
    await expect(page.getByText('Profile saved successfully!')).toBeVisible({ timeout: 10_000 });

    // Reload page
    await page.reload();
    await expect(page.locator('#name')).toHaveValue('Persistent User', { timeout: 10_000 });
    await expect(page.locator('#school')).toHaveValue('Stanford University');
    await expect(page.locator('#major')).toHaveValue('Data Science');
  });
});
