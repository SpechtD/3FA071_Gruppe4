
import { test, expect } from '@playwright/test';

/**
 * Test suite for the Dashboard page
 * 
 * These tests verify that the dashboard correctly displays overview data
 * and provides navigation to other sections of the application.
 */
test.describe('Dashboard page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  /**
   * Test that the dashboard displays key summary cards
   */
  test('should display summary cards', async ({ page }) => {
    // Check for summary card titles
    await expect(page.getByText('Total Customers')).toBeVisible();
    await expect(page.getByText('Total Readings')).toBeVisible();
    await expect(page.getByText('Readings per Customer')).toBeVisible();
    await expect(page.getByText('Most Common Meter')).toBeVisible();
  });

  /**
   * Test that the tabs function correctly
   */
  test('should switch between tabs', async ({ page }) => {
    // Should display customers tab by default
    await expect(page.getByText('Recent Customers')).toBeVisible();
    
    // Switch to readings tab
    await page.getByRole('tab', { name: 'Readings' }).click();
    await expect(page.getByText('Recent Readings')).toBeVisible();
  });

  /**
   * Test that quick action buttons are present
   */
  test('should display quick action buttons', async ({ page }) => {
    // Check for quick actions section
    await expect(page.getByText('Quick Actions')).toBeVisible();
    
    // Check for action buttons
    await expect(page.getByRole('button', { name: 'Add Customer' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New Reading' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export Data' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Import Data' })).toBeVisible();
  });

  /**
   * Test dashboard date range filter
   */
  test('should have a date range filter', async ({ page }) => {
    await expect(page.getByText('Date Range:')).toBeVisible();
    await expect(page.getByPlaceholder('Pick a date')).toBeVisible();
  });

  /**
   * Test navigation from dashboard to other pages
   */
  test('should navigate to other pages from dashboard', async ({ page }) => {
    // Click on "View All Customers" button
    await page.getByRole('button', { name: 'View All Customers' }).click();
    await expect(page).toHaveURL('/customers');
    
    // Go back to dashboard
    await page.goto('/');
    
    // Switch to readings tab and click view all
    await page.getByRole('tab', { name: 'Readings' }).click();
    await page.getByRole('button', { name: 'View All Readings' }).click();
    await expect(page).toHaveURL('/meters');
  });
});
