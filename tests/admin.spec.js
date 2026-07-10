import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('should load admin dashboard without crashing', async ({ page }) => {
    await page.goto('/velloreadmin');
    
    // Using the mobile header or sidebar header for Admin
    await expect(page.getByRole('heading', { name: 'Admin' }).first()).toBeVisible({ timeout: 15000 });
    
    await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
  });
});
