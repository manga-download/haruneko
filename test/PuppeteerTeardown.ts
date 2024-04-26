import fs from 'node:fs/promises';
import type { Browser } from 'puppeteer-core';
import { ChildProcess, exec } from 'node:child_process';

export default async function(/*config: Config.ConfigGlobals*/) {
    const server = global.SERVER as ChildProcess;
    const browser = global.BROWSER as Browser;
    const pages = await browser.pages();
    for(const page of pages) await page.close();
    await browser.close();
    switch (process.platform) {
        case 'win32':
            await new Promise(resolve => exec(`taskkill /pid ${server.pid} /T /F`, resolve));
            break;
        default:
            const signals = [ 'SIGINT', 'SIGTERM', 'SIGKILL' ];
            for(let index = 0; index < signals.length && server.exitCode === null; index++) {
                server.kill(signals[index] as NodeJS.Signals);
            }
            break;
    }
    if(server.exitCode === null) {
        console.warn('Failed to stop process:', server.spawnfile);
    }
    await fs.rm(global.TEMPDIR, { recursive: true });
    process.exit();
}