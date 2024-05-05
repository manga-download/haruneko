import * as puppeteer from 'puppeteer-core';
import { AppURL } from './PuppeteerGlobal';

export class PuppeteerFixture {

    constructor() {}

    public async Connect() {
        const browser = await puppeteer.connect({ browserWSEndpoint: process.env.browserWS });
        const pages = await browser.pages();
        const page = pages.find(page => page.url() === AppURL);
        await page.reload();
        await page.waitForSelector('body div#app main#hakunekoapp', { timeout: 7500 });
        return page;
    }
}