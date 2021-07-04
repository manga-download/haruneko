import os from 'os';
import path from 'path';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import puppeteer from 'puppeteer-core';

let server: ChildProcessWithoutNullStreams;
let browser: puppeteer.Browser;
let page: puppeteer.Page;

async function CloseSplashScreen(target: puppeteer.Target) {
    const page = await target.page();
    const url = await page.url();
    if(/splash.html/i.test(url)) {
        await page.close();
    }
}

export async function Setup(/*headless = true*/): Promise<void> {
    server = server || spawn('node', [
        path.join('..', 'node_modules', '.bin', 'http-server'),
        path.join('..', 'build.web'),
        '--port=5000'
    ]);
    browser = await puppeteer.launch({
        ignoreDefaultArgs: true,
        executablePath: 'node',
        args: [
            path.join('..', 'node_modules', '.bin', 'nw'),
            path.join('..', 'build.app'),
            '--user-data-dir=' + path.join(os.tmpdir(), 'hakuneko-test', `user-data-${(Date.now() + Math.random()).toString(16)}`)
        ]
    });
    browser.on('targetcreated', CloseSplashScreen);
    [ page ] = await browser.pages();
}

export async function Reload(): Promise<puppeteer.Page> {
    await page.reload();
    return page;
}

export async function Teardown(): Promise<void> {
    const pages = await browser.pages();
    for(const page of pages) {
        await page.close();
    }
    await browser.close();
    server.kill();
}