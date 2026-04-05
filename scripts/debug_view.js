import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

(async () => {
    console.log('\n--- [TACTICAL_DIAGNOSTICS_INITIATED] ---');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Intercept standard console logs
    page.on('console', msg => {
        const type = msg.type().toUpperCase();
        console.log(`[BROWSER_${type}] >> ${msg.text()}`);
    });

    // Intercept unhandled page errors
    page.on('pageerror', error => {
        console.error(`[BROWSER_FATAL_ERROR] !! ${error.message}`);
    });

    try {
        console.log('Attempting connection to UI @ port 5173...');
        await page.goto('http://localhost:5173/command-center', { 
            waitUntil: 'networkidle', 
            timeout: 15000 
        });

        // Additional wait for SVAR Gantt internal rendering
        await page.waitForTimeout(3000);

        const screenshotPath = path.join(process.cwd(), 'test-results', 'manual_debug_snapshot.png');
        
        // Ensure test-results directory exists
        const dir = path.dirname(screenshotPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        console.log('Capturing High-Fidelity Tactical State...');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`SNAPSHOT_STORED_AT: ${screenshotPath}`);

    } catch (e) {
        console.log(`[EXECUTION_FAILED] The app might not be running or is unreachable: ${e.message}`);
    } finally {
        await browser.close();
        console.log('--- [DIAGNOSTICS_TERMINATED] ---\n');
    }
})();
