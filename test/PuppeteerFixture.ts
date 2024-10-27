import * as puppeteer from 'puppeteer-core';
import { AppURL, AppSelector } from './PuppeteerGlobal';

export class PuppeteerFixture {

    static #browser = puppeteer.connect({ browserWSEndpoint: process.env.browserWS });
    static #page = this.#browser.then(browser => browser.pages()).then(pages => pages.find(page => page.url() === AppURL));

    protected async Reload(): Promise<void> {
        const page = await PuppeteerFixture.#page;
        await page.reload({ timeout: 5000 });
        await page.waitForSelector(AppSelector, { timeout: 7500 });
    }

    protected async OpenPage(url : string): Promise<puppeteer.Page> {
        const page = await (await PuppeteerFixture.#browser).newPage();
        await page.goto(url);
        return page;
    }

    protected EvaluateHandle: typeof puppeteer.Page.prototype.evaluateHandle = async (pageFunction, ...args) => {
        return (await PuppeteerFixture.#page).evaluateHandle(pageFunction, ...args);
    }
}