import { test, expect } from '@playwright/test';

test.describe('Dashboard page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display dashboard stats cards', async ({ page }) => {
    // Wait for cards to be visible
    await page.waitForSelector('.card, .grid > div > [class*="Card"]');
    
    // Check for three stats cards
    const statsCards = await page.locator('.card, .grid > div > [class*="Card"]').count();
    expect(statsCards).toBeGreaterThanOrEqual(3);
    
    // Verify total meters card
    await expect(page.getByText('Total Meters')).toBeVisible();
    
    // Verify total usage card
    await expect(page.getByText('Total Usage')).toBeVisible();
    await expect(page.getByText('Electricity:')).toBeVisible();
    await expect(page.getByText('Water:')).toBeVisible();
    await expect(page.getByText('Heating:')).toBeVisible();
    
    // Verify last updated card
    await expect(page.getByText('Last Updated')).toBeVisible();
  });

  test('should display consumption trend charts', async ({ page }) => {
    // Check heading
    await expect(page.getByRole('heading', { name: 'Consumption Trends' })).toBeVisible();
    
    // Check for charts
    await expect(page.getByText('Electricity Usage')).toBeVisible();
    await expect(page.getByText('Water Usage')).toBeVisible();
    await expect(page.getByText('Heating Usage')).toBeVisible();
  });
});
