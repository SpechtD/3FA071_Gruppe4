
import { test, expect } from '@playwright/test';

test.describe('Export page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/export');
  });

  test('should display export tabs', async ({ page }) => {
    // Check for tabs
    await expect(page.getByRole('tab', { name: 'Meter Reports' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Customer Reports' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Export Settings' })).toBeVisible();
    
    // Meter Reports should be selected by default
    await expect(page.getByRole('tab', { name: 'Meter Reports' })).toHaveAttribute('aria-selected', 'true');
  });

  test('should conditionally show meter selector only in Meter Reports tab', async ({ page }) => {
    // In Meter Reports tab, selector should be visible
    await expect(page.getByRole('tab', { name: 'Meter Reports' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByLabel('Select Meter:')).toBeVisible();
    
    // Switch to Customer Reports tab
    await page.getByRole('tab', { name: 'Customer Reports' }).click();
    
    // Meter selector should be hidden
    await expect(page.getByLabel('Select Meter:')).not.toBeVisible();
    
    // Switch to Export Settings tab
    await page.getByRole('tab', { name: 'Export Settings' }).click();
    
    // Meter selector should still be hidden
    await expect(page.getByLabel('Select Meter:')).not.toBeVisible();
  });

  test('should show export format options', async ({ page }) => {
    // Check for format options
    await expect(page.getByRole('radio', { name: 'CSV' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Excel' })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'PDF' })).toBeVisible();
    
    // Default should be selected
    await expect(page.getByRole('radio', { name: 'CSV' })).toBeChecked();
    
    // Can change format
    await page.getByRole('radio', { name: 'Excel' }).click();
    await expect(page.getByRole('radio', { name: 'Excel' })).toBeChecked();
  });

  test('should allow date range selection', async ({ page }) => {
    // Check for date range options
    await expect(page.getByText('Date Range:')).toBeVisible();
    await expect(page.getByText('Start Date:')).toBeVisible();
    await expect(page.getByText('End Date:')).toBeVisible();
  });
});
