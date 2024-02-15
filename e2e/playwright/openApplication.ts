import { Page, test as setup } from '@playwright/test';

async function waitForAngular(page) {
    const clientSideScripts = require('protractor/built/clientsidescripts.js');

    async function executeScriptAsync(page, script, ...scriptArgs) {
        await page.evaluate(`
      new Promise((resolve, reject) => {
        const callback = (errMessage) => {
          if (errMessage)
            reject(new Error(errMessage));
          else
            resolve();
        };
        (function() {${script}}).apply(null, [...${JSON.stringify(scriptArgs)}, callback]);
      })
    `);
    }

    await executeScriptAsync(page, clientSideScripts.waitForAngular, '');
}

/**
 * This is pretty pointless for this project so far, but we save one line of code per test.
 */

export async function openApplication(page: Page) {
    await page.goto('/');
    await waitForAngular(page);
}
