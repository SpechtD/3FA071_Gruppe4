
import { test, expect } from '@playwright/test';

test.describe('Import Guides page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/import-guides');
  });

  test('should display guide cards', async ({ page }) => {
    // Check for guide cards
    await expect(page.getByRole('heading', { name: 'Customer Data Format' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Meter Data Format' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Support' })).toBeVisible();
    
    // Check for example files section
    await expect(page.getByRole('heading', { name: 'Example Files' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download Customer Example' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download Meter Example' })).toBeVisible();
  });

  test('should navigate back to import page', async ({ page }) => {
    // Check for back button
    const backButton = page.getByRole('button').filter({ has: page.locator('svg[class*="ArrowLeft"]') });
    await expect(backButton).toBeVisible();
    
    // Click back button
    await backButton.click();
    
    // Should be on import page
    await expect(page).toHaveURL(/\/import/);
    await expect(page.getByRole('heading', { name: 'Import Data' })).toBeVisible();
  });
});
