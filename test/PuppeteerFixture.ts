import * as puppeteer from 'puppeteer-core';
import { AppURL } from './PuppeteerGlobal';
import type { Evasion } from './AutomationEvasions';

export class PuppeteerFixture {

    static #browser = puppeteer.connect({ browserWSEndpoint: process.env.browserWS });
    static #page = this.#browser.then(browser => browser.pages()).then(async pages => {
        const page = pages.find(page => page.url() === AppURL);
        await page.setCacheEnabled(false);
        return page;
    });

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
        // TODO: Introduce a condition to distinguish between Electron and non-Electron
        const page = await (false ? this.CreatePage() : this.CreatePageElectron());
        await Promise.all(evasions.map(setupEvasion => setupEvasion(page)));
        await page.setCacheEnabled(false);
        await page.goto(url);
        return page;
    }

    private async CreatePage(): Promise<puppeteer.Page> {
        return (await this.GetBrowser()).newPage();
    }

    private async CreatePageElectron(): Promise<puppeteer.Page> {
        const browser = await this.GetBrowser();
        const pageApp = await this.GetPage();
        await pageApp.evaluate(() => window.open('about:blank'));
        const start = Date.now();
        while(Date.now() - start < 7500) {
            const page = (await browser.pages()).find(page => page.url() === 'about:blank');
            if(page) return page;
        }
        throw new Error(`Could not open new page within the given timeout!`);
    }

    protected EvaluateHandle: typeof puppeteer.Page.prototype.evaluateHandle = async (pageFunction, ...args) => {
        return (await PuppeteerFixture.#page)!.evaluateHandle(pageFunction, ...args);
    }
}