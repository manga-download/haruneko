import * as puppeteer from 'puppeteer-core';
import { AppURL } from './PuppeteerGlobal';

export class PuppeteerFixture {

    static #browser = puppeteer.connect({ browserWSEndpoint: process.env.browserWS });
    static #page = this.#browser.then(browser => browser.pages()).then(pages => pages.find(page => page.url() === AppURL));

    private GetBrowser() {
        return PuppeteerFixture.#browser;
    }

    public GetPage() {
        return PuppeteerFixture.#page;
    }

    protected async OpenPage(url: string): Promise<puppeteer.Page> {
        const page = await (await this.GetBrowser()).newPage();
        await page.goto(url);
        return page;
    }

    protected EvaluateHandle: typeof puppeteer.Page.prototype.evaluateHandle = async (pageFunction, ...args) => {
        return (await PuppeteerFixture.#page)!.evaluateHandle(pageFunction, ...args);
    }
}