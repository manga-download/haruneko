import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { exec, spawn } from 'node:child_process';
import * as puppeteer from 'puppeteer-core';
import {
    SetupBlinkEvasions,
    EvadeWebDriverDetection,
    EvadeChromeDevToolProtocolDetection
} from './AutomationEvasions';

export const AppURL = 'https://localhost:5000/';
export const AppSelector = 'body #app main#hakunekoapp';
const viteExe = path.normalize(path.resolve('node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite'));
const tempDir = path.normalize(path.resolve(os.tmpdir(), 'hakuneko-test', Date.now().toString(32)));
const userDir = path.normalize(path.resolve(tempDir, 'user-data'));

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

async function DetectElectron(): Promise<string> {
    const executables = [
        'electron',
        'electron.exe',
        path.join('Electron.app', 'Contents', 'MacOS', 'Electron'),
    ];
    const rootModule = path.normalize(path.resolve('node_modules', 'electron'));
    const appModule = path.normalize(path.resolve('app', 'electron', 'node_modules', 'electron'));

    const search: string[] = [
        ... executables.map(segment => path.resolve(rootModule, 'dist', segment)),
        ... executables.map(segment => path.resolve(appModule, 'dist', segment)),
    ];

    for(const electron of search) {
        try {
            if((await fs.stat(path.normalize(electron))).isFile()) {
                console.log(new Date().toISOString(), '=>', 'Detected Electron:', electron);
                return electron;
            }
        } catch {}
    }

    throw new Error('Failed to detect location of Electron executable!');
}

async function LaunchElectron(): Promise<puppeteer.Browser> {
    const electronApp = path.resolve('app', 'electron', 'build');

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreDefaultArgs: true,
        executablePath: await DetectElectron(),
        args: [ electronApp, '--remote-debugging-port=0', '--disable-blink-features=AutomationControlled', '--origin=' + AppURL, '--ignore-certificate-errors', '--no-sandbox', '--disable-gpu' ],
        userDataDir: userDir,
        dumpio: true,
    });
    browser.on('targetcreated', CloseSplashScreen);
    SetupBlinkEvasions(browser, EvadeWebDriverDetection, EvadeChromeDevToolProtocolDetection);

    const start = Date.now();
    while(Date.now() - start < 7500) {
        const pages = await browser.pages();
        const page = pages.find(p => p.url() === AppURL);
        if(page) {
            await page.reload({ timeout: 5000 });
            await page.waitForSelector(AppSelector, { timeout: 7500 });
            console.log(new Date().toISOString(), '➔', 'Using Page:', [ page.url() ]);
            console.log(new Date().toISOString(), '➔', 'Remote Debugger:', browser.wsEndpoint());
            return browser;
        } else {
            console.log(new Date().toISOString(), '➔', 'Waiting for Page(s):', pages.map(p => p.url()));
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
        shell: process.platform === 'win32',
    });
    console.log(new Date().toISOString(), '=>', `Started Server (pid: ${server.pid}):`, server.exitCode === null);
    try {
        browser = await LaunchElectron();
        process.env.browserWS = browser.wsEndpoint();
    } catch(error) {
        server.kill('SIGINT') || server.kill('SIGTERM') || server.kill('SIGKILL');
        throw error;
    }
}

export async function teardown() {
    const pages = await browser.pages();
    for(const page of pages) {
        try {
            await page.close();
        } catch(error) {
            console.warn(new Date().toISOString(), '=>', 'Failed to close page:', page?.url());
        }
    }
    try {
       await browser.close(); 
    } catch(error) {
        console.warn(new Date().toISOString(), '=>', 'Failed to close browser');
    }
    switch (process.platform) {
        case 'win32':
            await new Promise(resolve => exec(`taskkill /pid ${server.pid} /T /F`, resolve));
            break;
        default:
            const signals: NodeJS.Signals[] = [ 'SIGINT', 'SIGTERM', 'SIGKILL' ];
            for(let index = 0; index < signals.length && server.exitCode === null && server.signalCode === null; index++) {
                console.log(new Date().toISOString(), '=>', signals[index], path.relative(process.cwd(), server.spawnfile), server.kill(signals[index]));
                await delay(1000);
            }
            break;
    }
    await delay(1000);
    if(server.exitCode === null && server.signalCode === null) {
        console.warn(new Date().toISOString(), '=>', `Failed to stop server (pid: ${server.pid}):`, path.relative(process.cwd(), server.spawnfile));
    }
    await fs.rm(tempDir, { recursive: true });
    process.exit();
}