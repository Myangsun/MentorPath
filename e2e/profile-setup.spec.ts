import { test, expect } from '@playwright/test';

test.describe('Profile Setup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
  });

  test('loads the profile page with form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Your Profile' })).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#school')).toBeVisible();
    await expect(page.locator('#major')).toBeVisible();
    await expect(page.locator('#graduationYear')).toBeVisible();
  });

  test('displays completion bar', async ({ page }) => {
    await expect(page.getByText(/\d+% complete/i)).toBeVisible();
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

  test('can select target industries', async ({ page }) => {
    const techButton = page.getByRole('button', { name: 'Technology', exact: true });
    await techButton.click();
    await expect(techButton).toHaveClass(/bg-brand-50/);

    const climateButton = page.getByRole('button', { name: 'Climate Tech', exact: true });
    await climateButton.click();
    await expect(climateButton).toHaveClass(/bg-brand-50/);
  });

  test('can select target roles', async ({ page }) => {
    const pmButton = page.getByRole('button', { name: 'Product Manager', exact: true });
    await pmButton.click();
    await expect(pmButton).toHaveClass(/bg-brand-50/);
  });

  test('can add and remove prior roles', async ({ page }) => {
    // Initially empty
    await expect(page.getByText('No prior roles added yet')).toBeVisible();

    // Add a role
    await page.getByRole('button', { name: 'Add Role' }).click();
    await expect(page.getByText('Role 1')).toBeVisible();

    // Fill role details
    await page.getByPlaceholder('Job title').fill('Software Engineer');
    await page.getByPlaceholder('Company name').fill('Google');

    // Remove the role
    await page.getByRole('button', { name: 'Remove role 1' }).click();
    await expect(page.getByText('No prior roles added yet')).toBeVisible();
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
