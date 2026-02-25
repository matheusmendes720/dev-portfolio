import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    retries: isCI ? 2 : 1,
    workers: 1,
    reporter: [
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['list'],
    ],
    use: {
        baseURL: isCI ? 'http://localhost:4173' : 'http://localhost:5173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
        actionTimeout: 10000,
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
    ],
    webServer: isCI ? {
        command: 'npx vite preview --port 4173',
        port: 4173,
        reuseExistingServer: false,
        timeout: 30000,
    } : undefined,
});
