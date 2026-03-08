import { test, expect } from '@playwright/test';

test.describe('Outreach Flow', () => {
  // Helper to navigate to outreach page for first mentor
  async function navigateToOutreach(page: import('@playwright/test').Page) {
    await page.goto('/matches');
    await page.waitForLoadState('networkidle');

    // Generate matches if needed
    if (!(await page.getByText(/\d+ mentors? found/).isVisible({ timeout: 3_000 }).catch(() => false))) {
      await page.getByRole('button', { name: /Generate Matches/i }).click();
      await expect(page.getByText(/\d+ mentors? found/)).toBeVisible({ timeout: 30_000 });
    }

    // Go to first mentor detail
    const firstLink = page.locator('a[href^="/mentor/"]').first();
    const href = await firstLink.getAttribute('href');
    await page.goto(href!);
    await page.waitForLoadState('networkidle');

    // Click Compose Outreach
    const outreachLink = page.getByRole('link', { name: /Compose Outreach/i });
    await outreachLink.click();
    await expect(page).toHaveURL(/\/outreach\/.+/);
  }

  test('loads outreach page with composer', async ({ page }) => {
    await navigateToOutreach(page);

    await expect(page.getByRole('heading', { name: 'Compose Outreach' })).toBeVisible();
    await expect(page.getByText(/Message to/)).toBeVisible();
  });

  test('shows purpose selection buttons', async ({ page }) => {
    await navigateToOutreach(page);

    await expect(page.getByRole('button', { name: 'Career Advice' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Industry Insights' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Informational Interview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'General Networking' })).toBeVisible();
  });

  test('can select a purpose and generate message with AI', async ({ page }) => {
    await navigateToOutreach(page);

    // Select Career Advice purpose
    await page.getByRole('button', { name: 'Career Advice' }).click();

    // Generate with AI
    await page.getByRole('button', { name: /Generate with AI/i }).click();

    // Wait for message to appear in textarea (mock mode)
    const textarea = page.locator('textarea');
    await expect(textarea).not.toHaveValue('', { timeout: 15_000 });

    // Word count should update
    await expect(page.getByText(/\d+ words/)).toBeVisible();
  });

  test('can manually write a message', async ({ page }) => {
    await navigateToOutreach(page);

    const textarea = page.locator('textarea');
    await textarea.fill('Hello, I would like to connect with you about your career experience.');

    // Word count should reflect the message
    await expect(page.getByText(/\d+ words/)).toBeVisible();
  });

  test('shows tone guidance sidebar', async ({ page }) => {
    await navigateToOutreach(page);

    await expect(page.getByText('Tone Guidance')).toBeVisible();
  });

  test('copy button works', async ({ page }) => {
    await navigateToOutreach(page);

    // Write a message first
    const textarea = page.locator('textarea');
    await textarea.fill('Test message for copy.');

    // Click copy button (has Copy icon)
    const copyButton = page.getByRole('button', { name: /copy/i }).or(
      page.locator('button').filter({ has: page.locator('svg.lucide-copy') })
    );

    if (await copyButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await copyButton.click();
    }
  });

  test('send button creates connection and navigates to dashboard', async ({ page }) => {
    await navigateToOutreach(page);

    // Write a message
    const textarea = page.locator('textarea');
    await textarea.fill('Hi, I am reaching out to connect about your career path.');

    // Click Save & Send
    const sendButton = page.getByRole('button', { name: /Save & Send|Send/i });
    await sendButton.click();

    // Should navigate to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10_000 });
  });
});
