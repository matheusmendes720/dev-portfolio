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
        
        // Since VITE_FEATURE_SECRET_GATE is false, gate is bypassed
        // and calendar should be visible directly
        const calendar = page.locator('.contest-calendar, [class*="calendar"]');
        await expect(calendar).toBeVisible({ timeout: 10000 });
    });

    // Note: To test the "disabled" state, one would normally use a separate 
    // test run with a different environment configuration.
});

test.describe('Feature Flag: Secret Gate', () => {
    test('gate is bypassed when feature flag is disabled', async ({ page }) => {
        // The VITE_FEATURE_SECRET_GATE is set to false in .env
        await page.goto('/contest_calendar');
        
        // The secret gate should NOT be visible (bypassed)
        const gate = page.locator('#secret-gate');
        await expect(gate).not.toBeVisible();
        
        // Calendar content should be visible directly
        const calendarContent = page.locator('body');
        await expect(calendarContent).not.toContainText('RESTRICTED ACCESS');
    });
});
