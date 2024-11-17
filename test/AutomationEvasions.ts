/**
 * Further Reading:
 * - https://github.com/paulirish/headless-cat-n-mouse/blob/master/apply-evasions.js
 * - https://deviceandbrowserinfo.com/learning_zone/articles/detecting-headless-chrome-puppeteer-2024
 * - https://www.reddit.com/r/webscraping/comments/1evht3i/help_in_bypassing_cdp_detection/
 * - https://github.com/kaliiiiiiiiii/brotector
 * - https://github.com/rebrowser/rebrowser-patches?tab=readme-ov-file
 */

import type { Browser, Target, Page } from 'puppeteer-core';

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

function EvadeWebDriverDetection(page: Page) {
    //page.evaluateOnNewDocument(`delete navigator.__proto__.webdriver`);
    //page.evaluateOnNewDocument(`navigator.__proto__.webdriver = false`);
}

/**
 * When dumping an object with the console functions, the properties of the object will be evaluated.
 * This evaluation only happens when the Developer Tools are opened, or a client is connected via CDP.
 * A proxy object could be used to detect access to getters of the object when it is dumped.
 */
function EvadeChromeDevToolProtocolDetection(page: Page) {
    page.evaluateOnNewDocument(`
        ${conceal}
        conceal(console, 'log', () => {});
        conceal(console, 'warn', () => {});
        conceal(console, 'error', () => {});
        conceal(console, 'debug', () => {});
        conceal(console, 'count', () => {});
        conceal(console, 'clear', () => {});
    `);
}

/**
 * Avoid automation detection for Blink-based browsers when used with Puppeteer.
 * This will only hide changes applied by Puppeteer to access the capabilities of the underlying Blink browser (e.g., Electron or NW.js).
 */
export function SetupBlinkEvasions(browser: Browser) {

    const activeBlinkEvasions = [
        //EvadeWebDriverDetection,
        EvadeChromeDevToolProtocolDetection,
    ];

    browser.on('targetcreated', async (target: Target) => {
        const page = await target.page();
        if(page) {
            for(const setupEvasion of activeBlinkEvasions) {
                setupEvasion(page);
            }
        }
    });
}