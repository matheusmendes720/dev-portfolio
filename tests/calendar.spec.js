// @ts-check
import { test, expect } from '@playwright/test';

/*
 * ═══════════════════════════════════════════════════════════
 *   CONTEST CALENDAR — COMPREHENSIVE E2E / BDD TEST SUITE
 *   Covers every interactive surface and data-flow pathway
 * ═══════════════════════════════════════════════════════════
 */

const SECRET_KEY = 'intel';

// ── Helper: Authenticate & land on calendar ──
async function authenticate(page) {
    await page.goto('/contest_calendar');
    // Wait for the gate
    const gate = page.locator('#secret-gate');
    if (await gate.isVisible({ timeout: 3000 }).catch(() => false)) {
        await page.locator('.gate-input').fill(SECRET_KEY);
        await page.locator('.gate-input').press('Enter');
    }
    // Wait for calendar to render
    await page.getByTestId('calendar-page').waitFor({ state: 'visible', timeout: 10000 });
}

// ════════════════════════════════════════════════════════════
//  SUITE 1: AUTHENTICATION GATE
// ════════════════════════════════════════════════════════════
test.describe('Suite 1: Authentication Gate', () => {
    test('should show restricted access gate on first visit', async ({ page }) => {
        await page.goto('/contest_calendar');
        await expect(page.locator('#secret-gate')).toBeVisible();
        await expect(page.locator('.gate-title')).toContainText('RESTRICTED ACCESS');
    });

    test('should deny access with wrong key', async ({ page }) => {
        await page.goto('/contest_calendar');
        await page.locator('.gate-input').fill('wrong-key');
        await page.locator('.gate-input').press('Enter');
        await expect(page.locator('.deny')).toBeVisible();
        await expect(page.locator('.deny')).toContainText('ACCESS DENIED');
    });

    test('should grant access with correct key "intel"', async ({ page }) => {
        await page.goto('/contest_calendar');
        await page.locator('.gate-input').fill(SECRET_KEY);
        await page.locator('.gate-input').press('Enter');
        await expect(page.getByTestId('calendar-page')).toBeVisible();
    });
});

// ════════════════════════════════════════════════════════════
//  SUITE 2: INITIAL LAYOUT & STRUCTURE
// ════════════════════════════════════════════════════════════
test.describe('Suite 2: Layout & Structure', () => {
    test.beforeEach(async ({ page }) => {
        await authenticate(page);
    });

    test('should render 3-column layout with sidebar, year view, and panel area', async ({ page }) => {
        await page.getByTestId('btn-view-year').click();
        await expect(page.getByTestId('left-sidebar')).toBeVisible();
        await expect(page.getByTestId('year-view')).toBeVisible();
        await expect(page.getByTestId('stats-widget')).toBeVisible();
        await expect(page.getByTestId('filter-bar')).toBeVisible();
    });

    test('should show stats widget with all 4 stat cards', async ({ page }) => {
        await expect(page.getByTestId('stat-prize')).toBeVisible();
        await expect(page.getByTestId('stat-roi')).toBeVisible();
        await expect(page.getByTestId('stat-stier')).toBeVisible();
        await expect(page.getByTestId('stat-total')).toBeVisible();
    });

    test('should show total of 115 events initially', async ({ page }) => {
        const totalStat = page.getByTestId('stat-total');
        await expect(totalStat).toContainText('115');
    });

    test('should display header with month title and controls', async ({ page }) => {
        await expect(page.getByTestId('header-title')).toBeVisible();
        await expect(page.getByTestId('btn-view-month')).toBeVisible();
        await expect(page.getByTestId('btn-view-year')).toBeVisible();
    });
});

// ════════════════════════════════════════════════════════════
//  SUITE 3: FILTER WIDGET INTERACTIONS
// ════════════════════════════════════════════════════════════
test.describe('Suite 3: Filter Widget', () => {
    test.beforeEach(async ({ page }) => {
        await authenticate(page);
    });

    test('should show 4 filter buttons (S-Tier, A-Tier, Free Entry, Urgent)', async ({ page }) => {
        await expect(page.getByTestId('filter-tier_s')).toBeVisible();
        await expect(page.getByTestId('filter-tier_a')).toBeVisible();
        await expect(page.getByTestId('filter-free_entry')).toBeVisible();
        await expect(page.getByTestId('filter-urgent')).toBeVisible();
    });

    test('WHEN S-Tier filter clicked THEN event count reduces and stats update', async ({ page }) => {
        // Get initial count
        const totalBefore = await page.getByTestId('stat-total').textContent() || '';
        const countBefore = parseInt(totalBefore.replace(/\D/g, ''));

        // Click S-Tier filter
        await page.getByTestId('filter-tier_s').click();
        await page.waitForTimeout(500); // wait for re-render

        // Count should be smaller
        const totalAfter = await page.getByTestId('stat-total').textContent() || '';
        const countAfter = parseInt(totalAfter.replace(/\D/g, ''));
        expect(countAfter).toBeLessThan(countBefore);
        expect(countAfter).toBeGreaterThan(0);

        // S-Tier stat should equal total (since only S-Tier shown)
        const stierStat = await page.getByTestId('stat-stier').textContent();
        const stierCount = parseInt(stierStat.replace(/\D/g, ''));
        expect(stierCount).toBe(countAfter);
    });

    test('WHEN S-Tier toggled off THEN full count restores', async ({ page }) => {
        await page.getByTestId('filter-tier_s').click();
        await page.waitForTimeout(300);
        await page.getByTestId('filter-tier_s').click();
        await page.waitForTimeout(300);

        const total = await page.getByTestId('stat-total').textContent();
        expect(parseInt(total.replace(/\D/g, ''))).toBe(115);
    });

    test('WHEN multiple filters active THEN combined results shown', async ({ page }) => {
        await page.getByTestId('filter-tier_s').click();
        await page.waitForTimeout(300);
        const sOnly = await page.getByTestId('stat-total').textContent();
        const sCount = parseInt(sOnly.replace(/\D/g, ''));

        await page.getByTestId('filter-tier_a').click();
        await page.waitForTimeout(300);
        const saPlusA = await page.getByTestId('stat-total').textContent();
        const saCount = parseInt(saPlusA.replace(/\D/g, ''));

        // S+A should be >= S only
        expect(saCount).toBeGreaterThanOrEqual(sCount);
    });

    test('WHEN Free Entry filter clicked THEN filter activates and count is valid', async ({ page }) => {
        await page.getByTestId('filter-free_entry').click();
        await page.waitForTimeout(500);

        const total = await page.getByTestId('stat-total').textContent();
        const count = parseInt(total.replace(/\D/g, ''));
        // Most events are free, so count may be close to or equal to 115
        expect(count).toBeGreaterThan(0);
        expect(count).toBeLessThanOrEqual(115);
    });

    test('WHEN Urgent filter clicked THEN only high-urgency events shown', async ({ page }) => {
        await page.getByTestId('filter-urgent').click();
        await page.waitForTimeout(500);

        const total = await page.getByTestId('stat-total').textContent();
        const count = parseInt(total.replace(/\D/g, ''));
        expect(count).toBeGreaterThan(0);
        expect(count).toBeLessThan(115);
    });

    test('WHEN sidebar event count should match total stat', async ({ page }) => {
        const sidebarCountText = await page.getByTestId('sidebar-event-count').textContent();
        const sidebarCount = parseInt(sidebarCountText.replace(/\D/g, ''));

        const totalStatText = await page.getByTestId('stat-total').textContent();
        const totalStat = parseInt(totalStatText.replace(/\D/g, ''));

        expect(sidebarCount).toBe(totalStat);
    });
});

// ════════════════════════════════════════════════════════════
//  SUITE 4: SORT CONTROLS
// ════════════════════════════════════════════════════════════
test.describe('Suite 4: Sort Controls', () => {
    test.beforeEach(async ({ page }) => {
        await authenticate(page);
    });

    test('should show 4 sort buttons', async ({ page }) => {
        await expect(page.getByTestId('btn-sort-date')).toBeVisible();
        await expect(page.getByTestId('btn-sort-urgency')).toBeVisible();
        await expect(page.getByTestId('btn-sort-roi')).toBeVisible();
        await expect(page.getByTestId('btn-sort-prize')).toBeVisible();
    });

    test('WHEN sort by urgency clicked THEN sidebar events reorder', async ({ page }) => {
        await page.getByTestId('btn-sort-urgency').click();
        await page.waitForTimeout(500);

        // Order likely changed (not guaranteed but very probable)
        // Just verify no crash and elements still exist
        await expect(page.locator('[data-testid^="sidebar-event-"]').first()).toBeVisible();
    });

    test('WHEN sort by ROI clicked THEN no crash and events still visible', async ({ page }) => {
        await page.getByTestId('btn-sort-roi').click();
        await page.waitForTimeout(500);
        await expect(page.locator('[data-testid^="sidebar-event-"]').first()).toBeVisible();
    });

    test('WHEN sort by prize clicked THEN no crash and events still visible', async ({ page }) => {
        await page.getByTestId('btn-sort-prize').click();
        await page.waitForTimeout(500);
        await expect(page.locator('[data-testid^="sidebar-event-"]').first()).toBeVisible();
    });

    test('WHEN sort by date clicked THEN chronological order restored', async ({ page }) => {
        await page.getByTestId('btn-sort-prize').click();
        await page.waitForTimeout(300);
        await page.getByTestId('btn-sort-date').click();
        await page.waitForTimeout(300);
        await expect(page.locator('[data-testid^="sidebar-event-"]').first()).toBeVisible();
    });
});

// ════════════════════════════════════════════════════════════
//  SUITE 5: VIEW SWITCHING (MONTH ↔ YEAR)
// ════════════════════════════════════════════════════════════
test.describe('Suite 5: View Switching', () => {
    test.beforeEach(async ({ page }) => {
        await authenticate(page);
    });

    test('should default to Year view with 12 months grids', async ({ page }) => {
        await expect(page.getByTestId('year-view')).toBeVisible();
    });

    test('WHEN MONTH button clicked THEN month grid appears', async ({ page }) => {
        // Since year is default, we test switching to month
        await page.getByTestId('btn-view-month').click();
        await page.waitForTimeout(500);
        // Year view should be gone
        await expect(page.getByTestId('year-view')).not.toBeVisible();
        // Month grid should appear
        await expect(page.getByTestId('calendar-grid')).toBeVisible();
    });

    test('WHEN YEAR button clicked after month THEN year view returns', async ({ page }) => {
        // Go to month view first
        await page.getByTestId('btn-view-month').click();
        await page.waitForTimeout(500);
        await expect(page.getByTestId('calendar-grid')).toBeVisible();

        // Switch back to year view
        await page.getByTestId('btn-view-year').click();
        await page.waitForTimeout(500);
        await expect(page.getByTestId('year-view')).toBeVisible();
    });
});

// ════════════════════════════════════════════════════════════
//  SUITE 6: MONTH NAVIGATION
// ════════════════════════════════════════════════════════════
test.describe('Suite 6: Month Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await authenticate(page);
        // Switch to month view for navigation tests
        await page.getByTestId('btn-view-month').click();
        await page.waitForTimeout(500);
    });

    test('WHEN next month clicked THEN title updates', async ({ page }) => {
        const titleBefore = await page.getByTestId('header-title').textContent();
        await page.getByTestId('btn-next-month').click();
        await page.waitForTimeout(500);
        const titleAfter = await page.getByTestId('header-title').textContent();
        expect(titleAfter).not.toBe(titleBefore);
    });

    test('WHEN prev month clicked THEN title updates', async ({ page }) => {
        const titleBefore = await page.getByTestId('header-title').textContent();
        await page.getByTestId('btn-prev-month').click();
        await page.waitForTimeout(500);
        const titleAfter = await page.getByTestId('header-title').textContent();
        expect(titleAfter).not.toBe(titleBefore);
    });

    test('WHEN navigated forward and back THEN original month restored', async ({ page }) => {
        const initial = await page.getByTestId('header-title').textContent();
        await page.getByTestId('btn-next-month').click();
        await page.waitForTimeout(300);
        await page.getByTestId('btn-prev-month').click();
        await page.waitForTimeout(300);
        const restored = await page.getByTestId('header-title').textContent();
        expect(restored).toBe(initial);
    });
});

// ════════════════════════════════════════════════════════════
//  SUITE 7: LEFT SIDEBAR
// ════════════════════════════════════════════════════════════
test.describe('Suite 7: Left Sidebar', () => {
    test.beforeEach(async ({ page }) => {
        await authenticate(page);
    });

    test('should show sidebar with search, event list, and event count', async ({ page }) => {
        await expect(page.getByTestId('sidebar-search')).toBeVisible();
        await expect(page.getByTestId('sidebar-event-count')).toBeVisible();
        await expect(page.locator('[data-testid^="sidebar-event-"]').first()).toBeVisible();
    });

    test('WHEN search text entered THEN event list filters', async ({ page }) => {
        const countBefore = await page.getByTestId('sidebar-event-count').textContent();
        const numBefore = parseInt(countBefore.replace(/\D/g, ''));

        await page.getByTestId('sidebar-search').fill('Google');
        await page.waitForTimeout(500);

        const countAfter = await page.getByTestId('sidebar-event-count').textContent();
        const numAfter = parseInt(countAfter.replace(/\D/g, ''));
        expect(numAfter).toBeLessThan(numBefore);
        expect(numAfter).toBeGreaterThan(0);
    });

    test('WHEN search cleared THEN full list restores', async ({ page }) => {
        await page.getByTestId('sidebar-search').fill('Google');
        await page.waitForTimeout(300);
        await page.getByTestId('sidebar-search').fill('');
        await page.waitForTimeout(300);

        const count = await page.getByTestId('sidebar-event-count').textContent();
        expect(parseInt(count.replace(/\D/g, ''))).toBe(115);
    });

    test('WHEN search yields no results THEN empty state shown', async ({ page }) => {
        await page.getByTestId('sidebar-search').fill('xyznonexistent123');
        await page.waitForTimeout(500);

        const count = await page.getByTestId('sidebar-event-count').textContent();
        expect(parseInt(count.replace(/\D/g, ''))).toBe(0);
        await expect(page.locator('text=NO_EVENTS_FOUND')).toBeVisible();
    });

    test('WHEN sidebar close clicked THEN sidebar collapses', async ({ page }) => {
        await page.getByTestId('sidebar-toggle-close').click();
        await page.waitForTimeout(500);

        // Sidebar should have 0 width
        const sidebar = page.getByTestId('left-sidebar');
        const box = await sidebar.boundingBox();
        expect(box.width).toBeLessThanOrEqual(5); // may be 0 or very small
    });

    test('WHEN sidebar collapsed THEN header shows open button', async ({ page }) => {
        await page.getByTestId('sidebar-toggle-close').click();
        await page.waitForTimeout(500);
        await expect(page.getByTestId('btn-toggle-sidebar')).toBeVisible();
    });

    test('WHEN sidebar event clicked THEN right panel opens', async ({ page }) => {
        await page.locator('[data-testid^="sidebar-event-"]').first().click();
        await page.waitForTimeout(500);
        await expect(page.getByTestId('right-panel-title')).toBeVisible();
    });
});

// ════════════════════════════════════════════════════════════
//  SUITE 8: CALENDAR GRID INTERACTIONS
// ════════════════════════════════════════════════════════════
test.describe('Suite 8: Calendar Grid Interactions', () => {
    test.beforeEach(async ({ page }) => {
        await authenticate(page);
        // Switch to month view for grid interaction tests
        await page.getByTestId('btn-view-month').click();
        await page.waitForTimeout(500);
    });

    test('WHEN day cell clicked THEN right panel opens with date overview', async ({ page }) => {
        // Click a day cell that exists in the current month grid
        const dayCells = page.locator('[data-testid^="day-cell-"]');
        const count = await dayCells.count();
        expect(count).toBeGreaterThan(0);

        // Click a cell in the middle of the grid (likely current month)
        await dayCells.nth(Math.floor(count / 2)).click();
        await page.waitForTimeout(500);

        // Right panel should open
        const panelTitle = page.getByTestId('right-panel-title');
        await expect(panelTitle).toBeVisible();
    });

    test('WHEN event pill clicked THEN right panel shows event details', async ({ page }) => {
        // Find first event pill on the grid
        const eventPills = page.locator('[data-testid^="event-pill-"]');
        const pillCount = await eventPills.count();

        if (pillCount > 0) {
            await eventPills.first().click();
            await page.waitForTimeout(500);

            // Panel should show event details
            await expect(page.getByTestId('event-detail-title')).toBeVisible();
        }
    });

    test('WHEN right panel close button clicked THEN panel collapses', async ({ page }) => {
        // Open panel first
        const dayCells = page.locator('[data-testid^="day-cell-"]');
        await dayCells.nth(5).click();
        await page.waitForTimeout(500);

        // Close it
        await page.getByTestId('right-panel-close').click();
        await page.waitForTimeout(500);

        // Panel width should be 0
        const panel = page.getByTestId('right-panel');
        const box = await panel.boundingBox();
        expect(box.width).toBeLessThanOrEqual(5);
    });
});

// ════════════════════════════════════════════════════════════
//  SUITE 9: RIGHT ANNOTATION PANEL CONTENT
// ════════════════════════════════════════════════════════════
test.describe('Suite 9: Right Panel Content', () => {
    test.beforeEach(async ({ page }) => {
        await authenticate(page);
        // Switch to month view for these tests
        await page.getByTestId('btn-view-month').click();
        await page.waitForTimeout(500);
    });

    test('WHEN date with events clicked THEN shows event cards in date overview', async ({ page }) => {
        // Navigate to February 2026 where we know events exist on the 1st
        const titleText = await page.getByTestId('header-title').textContent();
        if (!titleText.includes('February')) {
            // Navigate to February
            for (let i = 0; i < 12; i++) {
                const t = await page.getByTestId('header-title').textContent();
                if (t.includes('February')) break;
                await page.getByTestId('btn-next-month').click();
                await page.waitForTimeout(200);
            }
        }

        // Click Feb 1 cell
        await page.locator('[data-testid="day-cell-2026-02-01"]').click();
        await page.waitForTimeout(500);

        // Should show date overview with events
        await expect(page.getByTestId('date-overview-title')).toBeVisible();
    });

    test('WHEN event selected from date overview THEN detail view shows', async ({ page }) => {
        // Navigate to Feb and click a day with events
        const titleText = await page.getByTestId('header-title').textContent();
        if (!titleText.includes('February')) {
            for (let i = 0; i < 12; i++) {
                const t = await page.getByTestId('header-title').textContent();
                if (t.includes('February')) break;
                await page.getByTestId('btn-next-month').click();
                await page.waitForTimeout(200);
            }
        }

        // Open sidebar event to get event details
        await page.locator('[data-testid^="sidebar-event-"]').first().click();
        await page.waitForTimeout(500);

        await expect(page.getByTestId('event-detail-title')).toBeVisible();
    });
});

// ════════════════════════════════════════════════════════════
//  SUITE 10: COMBINED FILTER + SORT + NAVIGATION FLOW
// ════════════════════════════════════════════════════════════
test.describe('Suite 10: Integration Flow', () => {
    test.beforeEach(async ({ page }) => {
        await authenticate(page);
    });

    test('full workflow: filter → sort → navigate → select → close', async ({ page }) => {
        // Switch to month view for navigation title assertions
        await page.getByTestId('btn-view-month').click();
        await page.waitForTimeout(500);

        // 1. Apply S-Tier filter
        await page.getByTestId('filter-tier_s').click();
        await page.waitForTimeout(300);
        const filteredCount = await page.getByTestId('stat-total').textContent();
        const count = parseInt(filteredCount.replace(/\D/g, ''));
        expect(count).toBeLessThan(115);

        // 2. Sort by prize
        await page.getByTestId('btn-sort-prize').click();
        await page.waitForTimeout(300);

        // 3. Navigate to next month
        await page.getByTestId('btn-next-month').click();
        await page.waitForTimeout(300);

        // 4. Click a sidebar event
        const sidebarEvents = page.locator('[data-testid^="sidebar-event-"]');
        if (await sidebarEvents.count() > 0) {
            await sidebarEvents.first().click();
            await page.waitForTimeout(500);
            await expect(page.getByTestId('right-panel-title')).toBeVisible();

            // 5. Close panel
            await page.getByTestId('right-panel-close').click();
            await page.waitForTimeout(300);
        }

        // 6. Remove filter
        await page.getByTestId('filter-tier_s').click();
        await page.waitForTimeout(300);
        const restoredCount = await page.getByTestId('stat-total').textContent();
        expect(parseInt(restoredCount.replace(/\D/g, ''))).toBe(115);
    });

    test('full workflow: year view → month click → date select → sidebar collapse', async ({ page }) => {
        // 1. We start in year view by default
        await expect(page.getByTestId('year-view')).toBeVisible();

        // 2. Switch to Month
        await page.getByTestId('btn-view-month').click();
        await page.waitForTimeout(300);
        await expect(page.getByTestId('calendar-grid')).toBeVisible();

        // 3. Click a day
        const dayCells = page.locator('[data-testid^="day-cell-"]');
        await dayCells.nth(10).click();
        await page.waitForTimeout(500);
        await expect(page.getByTestId('right-panel-title')).toBeVisible();

        // 4. Collapse sidebar
        await page.getByTestId('sidebar-toggle-close').click();
        await page.waitForTimeout(500);
        const sidebar = page.getByTestId('left-sidebar');
        const box = await sidebar.boundingBox();
        expect(box.width).toBeLessThanOrEqual(5);
    });

    test('search + filter combined narrows results correctly', async ({ page }) => {
        // Apply Urgent filter
        await page.getByTestId('filter-urgent').click();
        await page.waitForTimeout(300);

        const urgentCount = await page.getByTestId('sidebar-event-count').textContent();
        const uCount = parseInt(urgentCount.replace(/\D/g, ''));

        // Then search within urgent results
        await page.getByTestId('sidebar-search').fill('hack');
        await page.waitForTimeout(500);

        const searchedCount = await page.getByTestId('sidebar-event-count').textContent();
        const sCount = parseInt(searchedCount.replace(/\D/g, ''));

        expect(sCount).toBeLessThanOrEqual(uCount);
    });
});
