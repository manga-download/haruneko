import fs from 'fs-extra';
import type { Config } from '@jest/types';
import type { Browser } from 'puppeteer-core';
import type { ChildProcessWithoutNullStreams } from 'child_process';

export default async function(config: Config.ConfigGlobals) {
    const server = global.SERVER as ChildProcessWithoutNullStreams;
    const browser = global.BROWSER as Browser;
    const pages = await browser.pages();
    for(const page of pages) await page.close();
    await browser.close();
    server.kill();
    await fs.rm(global.TEMPDIR, { recursive: true });
};