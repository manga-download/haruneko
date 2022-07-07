import type { Page } from 'puppeteer-core';
import NodeEnvironment from 'jest-environment-node';
import type { JestEnvironmentConfig, EnvironmentContext } from '@jest/environment';

export default class PuppeteerEnvironment extends NodeEnvironment {

    constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
        super(config, context);
        this.global.PAGE = global.PAGE;
        this.global.BROWSER = global.BROWSER;
    }

    // Run before each test ...
    async setup() {
        await super.setup();
        const page = this.global.PAGE as Page;
        await page.reload();
        await page.waitForSelector('body div#app main#hakunekoapp', { timeout: 7500 });
        this.global.PAGE = page;
    }

    // Run after each test ...
    async teardown() {
        await super.teardown();
    }
}