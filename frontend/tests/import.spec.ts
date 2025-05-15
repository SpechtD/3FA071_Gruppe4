
import { test, expect } from '@playwright/test';

test.describe('Import page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/import');
  });

  test('should display import cards', async ({ page }) => {
    // Check for customer import card
    await expect(page.getByRole('heading', { name: 'Import Customer Data' })).toBeVisible();
    
    // Check for meter readings import card
    await expect(page.getByRole('heading', { name: 'Import Meter Readings' })).toBeVisible();
    
    // Check for file selection buttons
    const selectButtons = await page.getByRole('button', { name: 'Select File' }).count();
    expect(selectButtons).toBe(2);
    
    // Check for upload buttons
    await expect(page.getByRole('button', { name: 'Upload Customer Data' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Upload Meter Readings' })).toBeVisible();
  });

  test('should navigate to import guides', async ({ page }) => {
    // Click import guides button
    await page.getByRole('button', { name: /view import guides/i }).click();
    
    // Should be on import guides page
    await expect(page).toHaveURL(/\/import-guides/);
    await expect(page.getByRole('heading', { name: 'Import Guides' })).toBeVisible();
  });
});
