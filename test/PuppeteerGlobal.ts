import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { exec, spawn } from 'node:child_process';
import * as puppeteer from 'puppeteer-core';

export const AppURL = 'http://localhost:5000/';
const viteExe = path.resolve('node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');
const tempDir = path.resolve(os.tmpdir(), 'hakuneko-test', Date.now().toString(32));
const userDir = path.resolve(tempDir, 'user-data');

let server: ReturnType<typeof spawn>;
let browser: puppeteer.Browser;

async function delay(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function CloseSplashScreen(target: puppeteer.Target) {
    const page = await target.page();
    let url = page?.url();
    while(!url?.startsWith('http')) {
        await delay(250);
        url = page?.url();
    }
    if(url && /splash.html/i.test(url)) {
        await page?.close();
    }
}

async function DetectNW(): Promise<string> {
    const executables = [
        'nw',
        'nw.exe',
        path.join('nwjs.app', 'Contents', 'MacOS', 'nwjs'),
    ];
    const rootModule = path.resolve('node_modules', 'nw');
    const appModule = path.resolve('app', 'nw', 'node_modules', 'nw');

    let search: string[] = [];
    try {
        const folder = (await fs.readdir(rootModule)).filter(entry => entry.startsWith('nwjs-')).shift() ?? 'nwjs';
        search = executables.map(segment => path.resolve(rootModule, folder, segment));
    } catch {}
    try {
        const folder = (await fs.readdir(appModule)).filter(entry => entry.startsWith('nwjs-')).shift() ?? 'nwjs';
        search = executables.map(segment => path.resolve(appModule, folder, segment));
    } catch {}

    for(const nw of search) {
        try {
            if((await fs.stat(nw)).isFile()) {
                console.log(new Date().toISOString(), '=>', 'Detected NW:', nw);
                return nw;
            }
        } catch {}
    }

    throw new Error('Failed to detect location of nw executable!');
}

async function LaunchNW(): Promise<puppeteer.Browser> {
    const nwApp = path.resolve('app', 'nw', 'build');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreDefaultArgs: true,
        executablePath: await DetectNW(),
        args: [ nwApp, '--disable-blink-features=AutomationControlled', '--origin=' + AppURL ],
        userDataDir: userDir
    });
    browser.on('targetcreated', CloseSplashScreen);

    const start = Date.now();
    while(Date.now() - start < 7500) {
        const pages = await browser.pages();
        const page = pages.find(p => p.url() === AppURL);
        if(page) {
            console.log(new Date().toISOString(), '=>', 'Using Page:', [ page.url() ]);
            return browser;
        } else {
            console.log(new Date().toISOString(), '=>', 'Waiting for Page(s):', pages.map(p => p.url()));
        }
        await delay(1000);
    }
    throw new Error(`Could not find the web-application '${AppURL}' within the given timeout!`);
}

export async function setup() {
    console.log(/* line break */);
    if(!AppURL.includes('localhost:5000')) {
        throw new Error(`Invalid startup URL '${AppURL}', make sure the application was build for production mode!`);
    }
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(userDir, { recursive: true });
    server = spawn(viteExe, [ 'preview', '--port=5000', '--strictPort' ], {
        cwd: path.resolve('web'),
        stdio: [ 'pipe', process.stdout, process.stderr ],
        shell : process.platform === 'win32',
    });
    try {
        browser = await LaunchNW();
        process.env.browserWS = browser.wsEndpoint();
    } catch(error) {
        server.kill('SIGINT') || server.kill('SIGTERM') || server.kill('SIGKILL');
        throw error;
    }
}

export async function teardown() {
    const pages = await browser.pages();
    for(const page of pages) await page.close();
    await browser.close();
    switch (process.platform) {
        case 'win32':
            await new Promise(resolve => exec(`taskkill /pid ${server.pid} /T /F`, resolve));
            break;
        default:
            const signals: NodeJS.Signals[] = [ 'SIGINT', 'SIGTERM', 'SIGKILL' ];
            for(let index = 0; index < signals.length && server.exitCode === null; index++) {
                console.log(new Date().toISOString(), '=>', signals[index], server.kill(signals[index]));
            }
            break;
    }
    await delay(1000);
    if(server.exitCode === null) {
        console.warn(new Date().toISOString(), '=>', `Failed to stop server (pid: ${server.pid}):`, path.relative(process.cwd(), server.spawnfile));
    }
    await fs.rm(tempDir, { recursive: true });
    process.exit();
}