
import { test, expect } from '@playwright/test';

/**
 * Test suite for the Export page
 * 
 * These tests verify that the export functionality works correctly,
 * including UI elements, format selection, and conditional display.
 */
test.describe('Export page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/export');
  });

  /**
   * Test that all export options and UI elements are displayed correctly
   */
  test('should display export options', async ({ page }) => {
    // Check for headers
    await expect(page.getByRole('heading', { name: 'Export Data' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Export Options' })).toBeVisible();
    
    // Check for data type selector
    await expect(page.getByLabel('Data Type')).toBeVisible();
    
    // Check for format buttons
    await expect(page.getByRole('button', { name: 'CSV' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'JSON' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'XML' })).toBeVisible();
    
    // Check for date range picker
    await expect(page.getByLabel('Date Range (Optional)')).toBeVisible();
    
    // Check export button
    await expect(page.getByRole('button', { name: 'Export Data' })).toBeVisible();
  });

  /**
   * Test that meter selector is conditionally displayed only when meter readings are selected
   */
  test('should conditionally show meter selector only when meter readings are selected', async ({ page }) => {
    // Meter type should not be visible initially
    await expect(page.getByLabel('Meter Type (Optional)')).not.toBeVisible();
    
    // Select readings data type
    await page.getByRole('combobox', { name: 'Data Type' }).click();
    await page.getByRole('option', { name: 'Meter Readings' }).click();
    
    // Meter type should be visible
    await expect(page.getByLabel('Meter Type (Optional)')).toBeVisible();
    
    // Select customers data type
    await page.getByRole('combobox', { name: 'Data Type' }).click();
    await page.getByRole('option', { name: 'Customers' }).click();
    
    // Meter type should not be visible
    await expect(page.getByLabel('Meter Type (Optional)')).not.toBeVisible();
  });

  /**
   * Test that export format buttons work correctly
   */
  test('should show export format buttons', async ({ page }) => {
    // Check for format buttons
    const csvButton = page.getByRole('button', { name: 'CSV' });
    const jsonButton = page.getByRole('button', { name: 'JSON' });
    const xmlButton = page.getByRole('button', { name: 'XML' });
    
    await expect(csvButton).toBeVisible();
    await expect(jsonButton).toBeVisible();
    await expect(xmlButton).toBeVisible();
    
    // CSV should be selected by default (has default variant)
    await expect(csvButton).toHaveClass(/bg-primary/);
    
    // Can change format
    await jsonButton.click();
    await expect(jsonButton).toHaveClass(/bg-primary/);
    await expect(csvButton).not.toHaveClass(/bg-primary/);
  });

  /**
   * Test that export templates are displayed
   */
  test('should show export templates', async ({ page }) => {
    // Check for export templates section
    await expect(page.getByRole('heading', { name: 'Export Templates' })).toBeVisible();
    
    // Check for template cards
    await expect(page.getByRole('heading', { name: 'All Customers (CSV)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Electricity Readings (JSON)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'All Readings (XML)' })).toBeVisible();
  });
});
