import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import * as puppeteer from 'puppeteer-core';

const appURL = 'http://localhost:5000/';
const viteExe = path.resolve('node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');
const tempDir = path.resolve(os.tmpdir(), 'hakuneko-test', Date.now().toString(32));
const userDir = path.resolve(tempDir, 'user-data');

async function CloseSplashScreen(target: puppeteer.Target) {
    const page = await target.page();
    let url = page?.url();
    while(!url?.startsWith('http')) {
        await new Promise(resolve => setTimeout(resolve, 250));
        url = page?.url();
    }
    if(url && /splash.html/i.test(url)) {
        await page?.close();
    }
}

async function DetectNW(): Promise<string> {
    const executables = [
        path.resolve('node_modules', 'nw', 'nwjs', 'nw'),
        path.resolve('node_modules', 'nw', 'nwjs', 'nw.exe'),
        path.resolve('node_modules', 'nw', 'nwjs', 'nwjs.app', 'Contents', 'MacOS', 'nwjs'),
        path.resolve('app', 'nw', 'node_modules', 'nw', 'nwjs', 'nw'),
        path.resolve('app', 'nw', 'node_modules', 'nw', 'nwjs', 'nw.exe'),
        path.resolve('app', 'nw', 'node_modules', 'nw', 'nwjs', 'nwjs.app', 'Contents', 'MacOS', 'nwjs'),
    ];

    for(const nw of executables) {
        try {
            if((await fs.stat(nw)).isFile()) {
                console.log(new Date().toISOString(), '=>', 'Detected NW:', nw);
                return nw;
            }
        } catch {}
    }

    throw new Error('Failed to detect location of nw executable!');
}

async function LaunchNW() {
    const nwApp = path.resolve('app', 'nw', 'build');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreDefaultArgs: true,
        executablePath: await DetectNW(),
        args: [ nwApp, '--disable-blink-features=AutomationControlled', '--origin=' + appURL ],
        userDataDir: userDir
    });
    browser.on('targetcreated', CloseSplashScreen);

    const start = Date.now();
    while(Date.now() - start < 7500) {
        const pages = await browser.pages();
        const page = pages.find(p => p.url() === appURL);
        if(page) {
            console.log(new Date().toISOString(), '=>', 'Using Page:', [ page.url() ]);
            global.PAGE = page;
            return browser;
        } else {
            console.log(new Date().toISOString(), '=>', 'Waiting for Page(s):', pages.map(p => p.url()));
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    throw new Error(`Could not find the web-application '${appURL}' within the given timeout!`);
}

export default async function(/*config: Config.ConfigGlobals*/) {
    console.log(/* line break */);
    if(!appURL.includes('localhost:5000')) {
        throw new Error(`Invalid startup URL '${appURL}', make sure the application was build for production mode!`);
    }
    global.TEMPDIR = tempDir;
    await fs.mkdir(global.TEMPDIR, { recursive: true });
    await fs.mkdir(userDir, { recursive: true });
    const server = spawn(viteExe, [ 'preview', '--port=5000', '--strictPort' ], {
        cwd: path.resolve('web'),
        stdio: [ 'pipe', process.stdout, process.stderr ],
        shell : true
    });
    global.SERVER = server;
    try {
        global.BROWSER = await LaunchNW();
    } catch(error) {
        server.kill('SIGINT') || server.kill('SIGTERM') || server.kill('SIGKILL');
        throw error;
    }
}