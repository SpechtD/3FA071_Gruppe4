
import { test, expect } from '@playwright/test';

test.describe('Imprint page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/imprint');
  });

  test('should display company information', async ({ page }) => {
    // Check for main sections
    await expect(page.getByRole('heading', { name: 'Company Information' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Disclaimer' })).toBeVisible();
    
    // Check for specific company details
    await expect(page.getByText('APT Manager GmbH')).toBeVisible();
    await expect(page.getByText(/Walter-Sedlmayr-Paltz 6/)).toBeVisible();
    await expect(page.getByText(/davidspecht@protonmail.com/)).toBeVisible();
  });
});
