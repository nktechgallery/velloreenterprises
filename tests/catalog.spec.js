import { test, expect } from '@playwright/test';

test.describe('Catalog and Home Page', () => {
  test('should load home page without server component errors', async ({ page }) => {
    await page.goto('/');
    
    // Check that there is no Next.js error overlay or 500 error text
    await expect(page.locator('body')).not.toContainText('Unsupported Server Component type: undefined');
    await expect(page.locator('body')).not.toContainText('Internal Server Error');
    
    // Verify hero text exists
    await expect(page.getByText(/Fire protection with/i)).toBeVisible({ timeout: 15000 });
  });

  test('should load products catalog', async ({ page }) => {
    await page.goto('/products');
    
    await expect(page.getByRole('heading', { name: 'Fire Protection Catalog' })).toBeVisible({ timeout: 15000 });
  });
});
