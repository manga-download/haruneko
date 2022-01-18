import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { spawn } from 'child_process';
import puppeteer from 'puppeteer-core';
import type { Config } from '@jest/types';

const nwApp = path.resolve('build.app');
const nwURL = fs.readJSONSync(path.resolve(nwApp, 'package.json')).main;
const nwExe = path.resolve('node_modules', '.bin', process.platform === 'win32' ? 'nw.cmd' : 'nw');
const viteExe = path.resolve('node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');
const tempDir = path.resolve(os.tmpdir(), 'hakuneko-test', Date.now().toString(32));
const userDir = path.resolve(tempDir, 'user-data');

async function CloseSplashScreen(target: puppeteer.Target) {
    const page = await target.page();
    const url = await page.url();
    if(/splash.html/i.test(url)) {
        await page.close();
    }
}

async function LaunchNW() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreDefaultArgs: true,
        executablePath: nwExe,
        args: [ nwApp ],
        userDataDir: userDir
    });
    browser.on('targetcreated', CloseSplashScreen);

    const start = Date.now();
    while(Date.now() - start < 7500) {
        const pages = await browser.pages();
        const page = pages.find(p => p.url() === nwURL);
        if(page) {
            console.log(new Date().toISOString(), '=>', 'Using Page:', page.url());
            global.PAGE = page;
            return browser;
        } else {
            console.log(new Date().toISOString(), '=>', 'Waiting for Page(s)', pages.map(p => p.url()));
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error(`Could not find the web-application '${nwURL}' within the given timeout!`);
}

export default async function(config: Config.ConfigGlobals) {
    console.log(/* line break */);
    if(!nwURL.includes('localhost:5000')) {
        throw new Error(`Invalid startup URL: '${nwURL}'`);
    }
    global.TEMPDIR = tempDir;
    await fs.mkdir(global.TEMPDIR, { recursive: true });
    await fs.mkdir(userDir, { recursive: true });
    global.SERVER = spawn(viteExe, [ 'preview' ]);
    global.BROWSER = await LaunchNW();
};