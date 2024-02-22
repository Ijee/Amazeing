import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './e2e/playwright',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:4200/',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        screenshot: 'on'
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                contextOptions: {
                    permissions: ['clipboard-read', 'clipboard-write']
                },
                viewport: { width: 1920, height: 1080 }
            }
        }
        // TODO: fix clipboard permissions for algorithm tests to re-enable this
        // {
        //     name: 'firefox',
        //     use: {
        //         ...devices['Desktop Firefox'],
        //         launchOptions: {
        //             firefoxUserPrefs: {
        //                 'dom.events.asyncClipboard.readText': true,
        //                 'dom.events.testing.asyncClipboard': true
        //             }
        //         },
        //         viewport: { width: 1920, height: 1080 }
        //     }
        // },
        //
        // {
        //     name: 'webkit',
        //     use: { ...devices['Desktop Safari'], viewport: { width: 1920, height: 1080 } }
        // }
    ],

    webServer: {
        command: ' ng serve',
        url: 'http://localhost:4200',
        reuseExistingServer: true,
        timeout: 60000
    }
});
