import * as puppeteer from 'puppeteer-core';
import { AppURL } from './PuppeteerGlobal';
import type { Evasion } from './AutomationEvasions';

export class PuppeteerFixture {

    static #browser = puppeteer.connect({ browserWSEndpoint: process.env.browserWS });
    static #page = this.#browser.then(browser => browser.pages()).then(pages => pages.find(page => page.url() === AppURL));

    private GetBrowser() {
        return PuppeteerFixture.#browser;
    }

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

    protected async OpenPage(url: string, ...evasions: Evasion[]): Promise<puppeteer.Page> {
        const page = await (await this.GetBrowser()).newPage();
        await Promise.all(evasions.map(setupEvasion => setupEvasion(page)));
        await page.goto(url);
        return page;
    }

    protected EvaluateHandle: typeof puppeteer.Page.prototype.evaluateHandle = async (pageFunction, ...args) => {
        return (await PuppeteerFixture.#page)!.evaluateHandle(pageFunction, ...args);
    }
}