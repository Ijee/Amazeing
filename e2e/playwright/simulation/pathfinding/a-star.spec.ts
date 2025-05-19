import { test, expect, Page } from '@playwright/test'; // Import Page type
import { openApplication } from '../../openApplication';

test.describe('A* Automaton @algorithm @maze', () => {
    let pageErrors: Error[] = [];
    let consoleErrors: string[] = [];

    // Helper function to set up listeners
    const setupErrorListeners = (page: Page) => {
        pageErrors = []; // Reset for each test
        consoleErrors = []; // Reset for each test

        page.on('pageerror', (exception) => {
            console.error(`Unhandled Page Error: ${exception.message}`);
            pageErrors.push(exception);
        });

        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                console.error(`Console Error: ${msg.text()}`);
                consoleErrors.push(msg.text());
            }
        });
    };

    // Helper function to assert no errors
    const expectNoErrors = () => {
        expect(pageErrors.length, 'No unhandled page errors should occur').toBe(0);
        expect(consoleErrors.length, 'No console.error messages should occur').toBe(0);
    };

    // Set up listeners before each test
    test.beforeEach(async ({ page }) => {
        setupErrorListeners(page);
        await openApplication(page);
        await page.getByTestId('pathfinding-mode').click();
        await page.getByTestId('a-star').click();
    });

    test('Algorithm completes', async ({ page }) => {
        await page.getByTestId('complete-algorithm').click();
        const iteration = parseInt((await page.getByTestId('iteration').textContent()) || '0'); // Add default for safety
        expect(iteration).toBeGreaterThan(0);
        expectNoErrors(); // Assert no errors at the end
    });

    test('Algorithm iteration 0 export dialog shows', async ({ page }) => {
        await page.getByTestId('export').click();
        expectNoErrors();
    });

    test('Algorithm 20 iterations; export then import and continue', async ({ page }) => {
        await page.getByTestId('next-iteration').click({ clickCount: 20 });
        await page.getByTestId('export').click();
        await page.getByTestId('copy-to-clipboard').click();

        await page.getByTestId('clear-grid').click();

        await page.getByTestId('import').click();
        const clipboardText: string = await page.evaluate('navigator.clipboard.readText()');
        await page.getByTestId('import-area').fill(clipboardText);
        await page.getByTestId('import-algorithm').click();

        await page.getByTestId('complete-algorithm').click();

        expectNoErrors();
    });

    test('Algorithm reset after 10 iterations, then complete', async ({ page }) => {
        await page.getByTestId('next-iteration').click({ clickCount: 10 });
        await page.getByTestId('clear-grid').click();
        await page.getByTestId('complete-algorithm').click();

        expectNoErrors();
    });

    test('Algorithm history does not error', async ({ page }) => {
        await page.getByTestId('next-iteration').click({ clickCount: 10 });
        await page.getByTestId('iteration-backward').click({ clickCount: 5 });
        await page.getByTestId('next-iteration').click({ clickCount: 6 });

        expectNoErrors();
    });
});
