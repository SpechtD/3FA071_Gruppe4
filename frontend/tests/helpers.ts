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

// Mock API responses for tests
export const mockApiResponses = () => {
  // Customers mock
  const mockCustomersResponse = {
    customers: [
      { id: "1", firstName: "John", lastName: "Doe", gender: "M", birthDate: "1985-05-15" },
      { id: "2", firstName: "Jane", lastName: "Smith", gender: "W", birthDate: "1990-10-20" },
      { id: "3", firstName: "Alex", lastName: "Johnson", gender: "D", birthDate: "1978-03-22" }
    ]
  };

  // Setup mocks
  return {
    setupMocks: async (page: any) => {
      await page.route('**/customers', async (route: any) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockCustomersResponse)
        });
      });

      // Add more route mocks as needed
    }
  };
};
