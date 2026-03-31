import { test, expect } from '@playwright/test';

/**
 * Feature Flag Verification
 * This test suite verifies that the /contest_calendar route 
 * respects the VITE_FEATURE_CONTEST_CALENDAR flag.
 */

test.describe('Feature Flag: Contest Calendar', () => {
    test('should be accessible when flag is enabled', async ({ page }) => {
        // Since we are running with the current .env (which should have the flag as true)
        await page.goto('/contest_calendar');
        
        // It should show the Secret Gate (Restricted Access)
        const gate = page.locator('#secret-gate');
        await expect(gate).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.gate-title')).toContainText('RESTRICTED ACCESS');
    });

    // Note: To test the "disabled" state, one would normally use a separate 
    // test run with a different environment configuration.
});
