import * as puppeteer from 'puppeteer-core';
import { AppURL } from './PuppeteerGlobal';

export class PuppeteerFixture {

    #browser: puppeteer.Browser;
    #page: puppeteer.Page;

    constructor() {}

    protected get Browser() {
        return this.#browser;
    }

    protected get Page() {
        return this.#page;
    }

    public async Connect<T extends this>(): Promise<T> {
        this.#browser = await puppeteer.connect({ browserWSEndpoint: process.env.browserWS });
        const pages = await this.#browser.pages();
        this.#page = pages.find(page => page.url() === AppURL);
        await this.#page.reload();
        await this.#page.waitForSelector('body div#app main#hakunekoapp', { timeout: 7500 });
        return this as T;
    }
}