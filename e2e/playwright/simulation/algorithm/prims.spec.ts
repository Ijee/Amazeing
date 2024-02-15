import { test, expect } from '@playwright/test';
import { openApplication } from '../../openApplication';

test.describe('Prims algorithm @algorithm @maze', () => {
    test.beforeEach(async ({ page }) => {
        await openApplication(page);
    });

    test('Algorithm completes @regression', async ({ page }) => {
        await expect(page).toHaveTitle('Amazeing');
    });
});
