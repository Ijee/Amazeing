import { test, expect } from '@playwright/test';
import { openApplication } from '../../../openApplication';

test.describe('Sidewinder @algorithm @maze', () => {
    test.beforeEach(async ({ page }) => {
        await openApplication(page);
        await page.getByTestId('sidewinder').click();
    });

    test('Algorithm completes', async ({ page }) => {
        const errors = [];
        page.on('pageerror', (exception) => {
            errors.push(exception);
        });

        await page.getByTestId('complete-algorithm').click();
        const iteration = parseInt(await page.getByTestId('iteration').textContent());
        expect(iteration).toBeGreaterThan(1);
        expect(errors.length).toBe(0);
    });

    test('Algorithm iteration 0 export dialog shows', async ({ page }) => {
        const errors = [];
        page.on('pageerror', (exception) => {
            errors.push(exception);
        });

        await page.getByTestId('export').click();

        expect(errors.length).toBe(0);
    });

    test('Algorithm 20 iterations; export then import and continue', async ({ page }) => {
        // await context.grantPermissions(['clipboard-read', 'clipboard-write']);

        const errors = [];
        page.on('pageerror', (exception) => {
            errors.push(exception);
        });

        await page.getByTestId('next-iteration').click({ clickCount: 20 });
        await page.getByTestId('export').click();
        await page.getByTestId('copy-to-clipboard').click();

        await page.getByTestId('clear-grid').click();

        await page.getByTestId('import').click();
        const clipboardText: string = await page.evaluate('navigator.clipboard.readText()');
        await page.getByTestId('import-area').fill(clipboardText);
        await page.getByTestId('import-algorithm').click();

        await page.getByTestId('complete-algorithm').click();

        expect(errors.length).toBe(0);
    });

    test('Algorithm reset after 10 iterations, then complete', async ({ page }) => {
        const errors = [];
        page.on('pageerror', (exception) => {
            errors.push(exception);
        });

        await page.getByTestId('next-iteration').click({ clickCount: 10 });
        await page.getByTestId('clear-grid').click();
        await page.getByTestId('complete-algorithm').click();

        expect(errors.length).toBe(0);
    });

    test('Algorithm history does not error', async ({ page }) => {
        const errors = [];
        page.on('pageerror', (exception) => {
            errors.push(exception);
        });

        await page.getByTestId('next-iteration').click({ clickCount: 10 });
        await page.getByTestId('iteration-backward').click({ clickCount: 5 });
        await page.getByTestId('next-iteration').click({ clickCount: 6 });

        expect(errors.length).toBe(0);
    });
});
