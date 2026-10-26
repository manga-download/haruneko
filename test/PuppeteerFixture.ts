import * as puppeteer from 'puppeteer-core';
import { AppURL } from './PuppeteerGlobal';

export class PuppeteerFixture {

    static #browser = puppeteer.connect({ browserWSEndpoint: process.env.browserWS, defaultViewport: null });
    static #page = this.#browser.then(browser => browser.pages()).then(async pages => {
        const page = pages.find(page => page.url() === AppURL);
        await page!.setCacheEnabled(false);
        return page;
    });

    public Log(...data: unknown[]) {
        console.log(new Date().toISOString(), '➔', ...data);
    }

    /**
     * Helper function to wait for a given {@link timespan} (in _milliseconds_).
     * Can be useful e.g., when it takes some time for updating dynamic elements in the frontend.
     */
    public async Delay(timespan: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, timespan));
    }

    public async GetPage() {
        const page = await PuppeteerFixture.#page;
        await page.bringToFront();
        return page;
    }

    public async Screenshot(label?: string) {
        const page = await this.GetPage();
        await page.screenshot({
            type: 'png',
            fullPage: true,
            captureBeyondViewport: true,
            path: `./test/screenshots/${new Date().toISOString().replaceAll(':', '-')} - ${label || 'Screenshot'}.png`,
        });
    }

    protected EvaluateHandle: typeof puppeteer.Page.prototype.evaluateHandle = async (pageFunction, ...args) => (await PuppeteerFixture.#page).evaluateHandle(pageFunction, ...args);
}
