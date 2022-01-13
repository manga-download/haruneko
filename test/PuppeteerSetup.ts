import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { spawn } from 'child_process';
import puppeteer from 'puppeteer-core';
import type { Config } from '@jest/types';
import { main } from '../build.app/package.json';

const nwURL = main;
const nwApp = path.resolve('.', 'build.app');
const nwExe = path.resolve('.', 'node_modules', '.bin', 'nw');
const viteExe = path.resolve('.', 'node_modules', '.bin', 'vite');
const tempDir = path.join(os.tmpdir(), 'hakuneko-test', Date.now().toString(32));
const userDir = '/Users/ronny/Desktop/testing/' + Date.now().toString(32); // path.resolve(tempDir, 'user-data');

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
        executablePath: 'node',
        args: [ nwExe, nwApp ], // `--user-data-dir=${userDir}`
        userDataDir: userDir
    });
    browser.on('targetcreated', CloseSplashScreen);

    const start = Date.now();
    while(Date.now() - start < 7500) {
        const pages = await browser.pages();
        const page = pages.find(p => p.url() === nwURL);
        if(page) {
            console.log('> Using:', global.PAGE);
            global.PAGE = page;
            return browser;
        } else {
            console.log(new Date().toISOString(), 'Waiting for Page...', pages.map(p => p.url()));
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error(`Could not find the web-application '${nwURL}' within the given timeout!`);
}

export default async function(config: Config.ConfigGlobals) {
    if(!nwURL.includes('localhost:5000')) {
        throw new Error(`Invalid startup URL: '${nwURL}'`);
    }
    global.TEMPDIR = tempDir;
    await fs.mkdir(global.TEMPDIR, { recursive: true });
    global.SERVER = spawn('node', [ viteExe, 'preview' ]);
    global.BROWSER = await LaunchNW();
};