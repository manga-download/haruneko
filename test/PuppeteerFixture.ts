import * as os from 'os';
import * as path from 'path';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as puppeteer from 'puppeteer-core';
// const userData = path.join(os.tmpdir(), 'hakuneko-test', `user-data-${Date.now().toString(16)}`);

let server: ChildProcessWithoutNullStreams;
let browser: puppeteer.Browser;
let page: puppeteer.Page;

export async function Setup(headless = true): Promise<puppeteer.Page> {
    server = spawn('node', [
        path.join('..', 'node_modules', '.bin', 'http-server'),
        path.join('..', 'build.web'),
        '--port=5000'
    ]);
    //server = spawn('node ../node_modules/.bin/http-server ../build.web --port=5000 2>&1 ./serve.log');
    browser = await puppeteer.launch({
        headless: headless,
        ignoreDefaultArgs: true,
        executablePath: 'node',
        args: [
            path.join('..', 'node_modules', '.bin', 'nw'),
            path.join('..', 'build.app')
        ]
    });
    [ page ] = await browser.pages();
    // TODO: wait until application is loaded in NW.js
    //await page.waitForTimeout(2500);
    //await page.evaluate(() => nw.Window.get().hideDevTools());
    return page;
}

export async function Teardown(): Promise<void> {
    await page.close();
    await browser.close();
    server.kill();
}