
import { test, expect } from '@playwright/test';
import { expectSidebarVisible, expectPageHeading, navigateVia } from './helpers';

test.describe('Navigation tests', () => {
  test('should navigate to all main pages', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    await expectSidebarVisible(page);
    await expectPageHeading(page, 'Dashboard');

    // Navigate to Import page
    await navigateVia(page, 'Import Data');
    await expectPageHeading(page, 'Import Data');

    // Navigate to Export page
    await navigateVia(page, 'Export Data');
    await expectPageHeading(page, 'Export Data');

    // Navigate to Meters page
    await navigateVia(page, 'Meters');
    await expectPageHeading(page, 'Utility Meters');

    // Navigate to Customers page
    await navigateVia(page, 'Customers');
    await expectPageHeading(page, 'Customers');

    // Navigate to Imprint page
    await navigateVia(page, 'Imprint');
    await expectPageHeading(page, 'Imprint');
    
    // Back to Dashboard
    await navigateVia(page, 'Dashboard');
    await expectPageHeading(page, 'Dashboard');
  });

  test('handles 404 page correctly', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Oops! Page not found')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Return to Home' })).toBeVisible();
  });
});
