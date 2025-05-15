
import { test, expect } from '@playwright/test';

test.describe('Meters page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/meters');
  });

  test('should display meter filters', async ({ page }) => {
    // Check for search input
    const searchInput = page.getByPlaceholder('Search all meters by ID...');
    await expect(searchInput).toBeVisible();
    
    // Check for filter toggles
    const filterSection = page.getByText('Filter by type:');
    await expect(filterSection).toBeVisible();
    
    // Check for toggle buttons
    await expect(page.getByRole('button', { name: /electricity/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /water/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /heating/i })).toBeVisible();
  });

  test('should filter meters when searching', async ({ page }) => {
    // Get initial meter count
    const initialCount = await page.locator('.grid > div > .card').count();
    expect(initialCount).toBeGreaterThan(0);
    
    // Enter search term that should match something
    await page.getByPlaceholder('Search all meters by ID...').fill('M-EL-001');
    
    // Wait for filtered results
    await page.waitForTimeout(500); // Small delay for filter to apply
    
    // Should show fewer meters now
    const filteredCount = await page.locator('.grid > div > .card').count();
    expect(filteredCount).toBeLessThan(initialCount);
    
    // Should show our specific meter
    await expect(page.getByText('M-EL-001')).toBeVisible();
  });

  test('should toggle meter types with filters', async ({ page }) => {
    // Get initial meter count with all filters active
    const initialCount = await page.locator('.grid > div > .card').count();
    
    // Click to deselect electricity
    await page.getByRole('button', { name: /electricity/i }).click();
    
    // Wait for filter to apply
    await page.waitForTimeout(500);
    
    // Should show fewer meters now
    const filteredCount = await page.locator('.grid > div > .card').count();
    expect(filteredCount).toBeLessThan(initialCount);
    
    // Electricity meters should not be visible
    await expect(page.getByText('M-EL-001')).not.toBeVisible();
  });
});
