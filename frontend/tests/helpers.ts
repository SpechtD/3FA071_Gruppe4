
import { expect, Page } from '@playwright/test';

/**
 * Helpers for Playwright tests
 */

/**
 * Checks if the sidebar navigation is visible and contains expected links
 * @param page - Playwright page object
 */
export async function expectSidebarVisible(page: Page) {
  const sidebar = await page.locator('div.bg-sidebar');
  await expect(sidebar).toBeVisible();
  
  // Check for navigation links
  const dashboardLink = await sidebar.getByRole('link', { name: /dashboard/i });
  await expect(dashboardLink).toBeVisible();
}

/**
 * Checks if the page has the expected heading
 * @param page - Playwright page object
 * @param title - Expected heading text
 */
export async function expectPageHeading(page: Page, title: string) {
  const heading = await page.locator('h1').filter({ hasText: title });
  await expect(heading).toBeVisible();
}

/**
 * Navigates to a specific page using the sidebar
 * @param page - Playwright page object
 * @param linkText - Text of the navigation link
 */
export async function navigateVia(page: Page, linkText: string) {
  await page.getByRole('link', { name: new RegExp(linkText, 'i') }).click();
}
