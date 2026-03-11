import * as puppeteer from 'puppeteer-core';
import { AppURL } from './PuppeteerGlobal';

export class PuppeteerFixture {

    static #browser = puppeteer.connect({ browserWSEndpoint: process.env.browserWS, defaultViewport: null });
    static #page = this.#browser.then(browser => browser.pages()).then(async pages => {
        const page = pages.find(page => page.url() === AppURL);
        await page!.setCacheEnabled(false);
        return page;
    });

    public GetPage() {
        return PuppeteerFixture.#page;
    }

    public async Screenshot(page: puppeteer.Page) {
        await page.screenshot({
            type: 'png',
            fullPage: true,
            captureBeyondViewport: true,
            path: `./screenshot_${Date.now().toString(36)}.png`,
        });
    }

    protected EvaluateHandle: typeof puppeteer.Page.prototype.evaluateHandle = async (pageFunction, ...args) => (await PuppeteerFixture.#page)!.evaluateHandle(pageFunction, ...args);
}
