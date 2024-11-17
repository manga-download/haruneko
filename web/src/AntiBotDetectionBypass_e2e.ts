/**
 * Check the bot-detection bypass capabilities of HakuNeko's underlying Blink browser engine (NW.js, Electron)
 */

import { describe, it, expect } from 'vitest';
import type { Page } from 'puppeteer-core';
import { PuppeteerFixture } from '../../test/PuppeteerFixture';

export class TestFixture extends PuppeteerFixture {

    private page: Page;

    public async WithPage(url: string): Promise<TestFixture> {
        await this.ClosePage();
        this.page = await this.OpenPage(url);
        console.log('WebDriver:', await this.page.evaluate(() => window.navigator.webdriver));
        console.log('User-Agent:', await this.page.evaluate(() => window.navigator.userAgent));
        console.log('Console:', await this.page.evaluate(() => console.debug.toString()));
        return this;
    }

    public async ClosePage(): Promise<void> {
        return this.page?.close();
    }

    public async AssertElementText(selector: string, expected: string): Promise<void> {
        try {
            await this.page.waitForSelector(selector, { timeout: 5000 });
            const actual = await this.page.$eval(selector, (element: HTMLElement) => element.innerText);
            expect(actual).toBe(expected);
        } catch(error) {
            await this.page.screenshot({
                type: 'png',
                fullPage: true,
                captureBeyondViewport: true,
                path: `./screenshot_${Date.now().toString(16)}.png`
            });
            await new Promise(resolve => setTimeout(resolve, 5_000));
            throw error;
        }
    }
}

describe('BrowserScan', { timeout: 10_000 }, () => {

    it('Should pass Bot Detection Test', async () => {
        const fixture = await new TestFixture().WithPage('https://www.browserscan.net/bot-detection');
        try {
            await fixture.AssertElementText(`div._5h5tql svg use[*|href="#status_success"]`, undefined);
        } finally {
            fixture.ClosePage();
        }
    });
});

describe('CloudFlare', { timeout: 10_000 }, () => {

    it('Should bypass JavaScript Challenge', async () => {
        const fixture = await new TestFixture().WithPage('https://cloudflare.bot-check.ovh/automatic');
        try {
            await fixture.AssertElementText('#hash', '801BE7B2C3621A7DE738CF77BD4EF264');
        } finally {
            fixture.ClosePage();
        }
    });

    it.skip('Should bypass Turnstile Non-Interactive Challenge', async () => {
        const fixture = await new TestFixture().WithPage('https://cloudflare.bot-check.ovh/turnstile-automatic');
        try {
            await fixture.AssertElementText('#hash', 'A9B6FA3DD8842CD8E2D6070784D92434');
        } finally {
            fixture.ClosePage();
        }
    });

    it.skip('Should bypass Turnstile Invisible Challenge', async () => {
        const fixture = await new TestFixture().WithPage('https://cloudflare.bot-check.ovh/turnstile-invisible');
        try {
            await fixture.AssertElementText('#hash', 'A9B6FA3DD8842CD8E2D6070784D92434');
        } finally {
            fixture.ClosePage();
        }
    });
});

describe('Vercel', { timeout: 10_000 }, () => {

    it.skip('Should bypass Attack Challenge Mode', async () => {
        const fixture = await new TestFixture().WithPage('https://vercel.bot-check.ovh');
        try {
            await fixture.AssertElementText('#hash', 'FDF049D4B2312945BB7AA2158F041278');
        } finally {
            fixture.ClosePage();
        }
    });
});