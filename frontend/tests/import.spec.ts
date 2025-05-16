
import { test, expect } from '@playwright/test';

/**
 * Test suite for the Import page
 * 
 * These tests verify that the import functionality works correctly,
 * including UI elements and modals for file selection.
 */
test.describe('Import page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/import');
  });

  /**
   * Test that import cards are displayed correctly
   */
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

  /**
   * Test that file selection modals open correctly
   */
  test('should open file selection modals', async ({ page }) => {
    // Open customer import modal
    await page.getByRole('button', { name: 'Select File' }).first().click();
    
    // Check modal content
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Import Customer Data' })).toBeVisible();
    await expect(page.getByLabel('File Format')).toBeVisible();
    await expect(page.getByLabel('Upload File')).toBeVisible();
    
    // Close modal
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    
    // Open meter readings import modal
    await page.getByRole('button', { name: 'Select File' }).nth(1).click();
    
    // Check modal content
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Import Meter Readings' })).toBeVisible();
    await expect(page.getByLabel('File Format')).toBeVisible();
    await expect(page.getByLabel('Upload File')).toBeVisible();
    
    // Close modal
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
