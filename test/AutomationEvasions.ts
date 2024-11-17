/**
 * Further Reading:
 * - https://github.com/paulirish/headless-cat-n-mouse/blob/master/apply-evasions.js
 * - https://deviceandbrowserinfo.com/learning_zone/articles/detecting-headless-chrome-puppeteer-2024
 * - https://www.reddit.com/r/webscraping/comments/1evht3i/help_in_bypassing_cdp_detection/
 * - https://github.com/kaliiiiiiiiii/brotector
 * - https://github.com/rebrowser/rebrowser-patches?tab=readme-ov-file
 */

import { type Browser, type Target, TargetType, type Page } from 'puppeteer-core';

export type Evasion = (page: Page) => Promise<void>;

const conceal = `
    function conceal(obj, key, intercept) {
        function toString() {
            return 'function ' + this.name + '() { [native code] }';
        }
        Object.defineProperty(toString, 'toString', {
            value: toString,
            writable: false,
            enumerable: false,
        });
        Object.defineProperty(toString, 'prototype', {
            value: undefined,
            writable: false,
            enumerable: false,
        });
        obj[key] = new Proxy(obj[key], {
            get(target, key, receiver) {
                return key === 'toString' ? toString : Reflect.get(target, key);
            },
            apply: intercept,
        });
    }
`;

/*
function EvadeWebDriverDetection(page: Page) {
    //await page.evaluateOnNewDocument(`delete navigator.__proto__.webdriver`);
    await page.evaluateOnNewDocument(`navigator.__proto__.webdriver = false`);
}
*/

/**
 * When dumping an object with the console functions, the properties of the object will be evaluated.
 * This evaluation only happens when the Developer Tools are opened, or a client is connected via CDP.
 * A proxy object could be used to detect access to getters of the object when it is dumped.
 */
export async function EvadeChromeDevToolProtocolDetection(page: Page) {
    await page.evaluateOnNewDocument(`
        ${conceal}
        conceal(console, 'log', () => {});
        conceal(console, 'warn', () => {});
        conceal(console, 'error', () => {});
        conceal(console, 'debug', () => {});
    `);
}

/**
 * Avoid automation detection for Blink-based browsers when used with Puppeteer.
 * This will only hide changes applied by Puppeteer to access the capabilities of the underlying Blink browser (e.g., Electron or NW.js).
 */
export function SetupBlinkEvasions(browser: Browser, ...evasions: Evasion[]) {
    // TODO: This doesn't work yet due to injection being too slow
    //       => https://github.com/puppeteer/puppeteer/issues/3667
    browser.on('targetcreated', async (target: Target) => {
        if(target.type() === TargetType.PAGE) {
            const page = await target.page();
            await Promise.all(evasions.map(setupEvasion => setupEvasion(page)));
        }
    });
}