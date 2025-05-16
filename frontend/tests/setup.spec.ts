
import { test, expect } from '@playwright/test';

test.describe('Application setup', () => {
  test('should load the application correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for main layout elements
    await expect(page.locator('div.flex.h-screen')).toBeVisible();
    await expect(page.locator('div.bg-sidebar')).toBeVisible();
    
    // Check for main content area
    await expect(page.locator('div.flex-1')).toBeVisible();
    
    // No console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Allow time for any async errors to appear
    await page.waitForTimeout(1000);
    
    // Should have no console errors
    expect(errors.length).toBe(0);
  });

  test('app has correct sidebar links', async ({ page }) => {
    await page.goto('/');
    
    // Check for all expected navigation links
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /import data/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /export data/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /meters/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /customers/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /imprint/i })).toBeVisible();
    
    // Import Guides link should not be present
    await expect(page.getByRole('link', { name: /import guides/i })).not.toBeVisible();
  });
});
