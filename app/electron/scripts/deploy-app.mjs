import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import extract from 'extract-zip';
import { download } from '../../tools.mjs';

const pkgFile = 'package.json';
const pkgConfig = JSON.parse(await fs.readFile(pkgFile));
const dirRes = path.join('..', 'res');
const dirApp = path.join('.', 'build');
const dirOut = path.join('.', 'bundle');

const electronVersion = pkgConfig.devDependencies.electron;

/**
 * Download a redistributable archive of Electron for the given parameters to the temp directory of the operating system.
 * Extract the content to the build directory which should be bundled for redistribution.
 * @param electronVersion ...
 * @param nwBuildType ...
 * @param electronPlatform ...
 * @param electronArchitecture ...
 */
async function redist(electronVersion, electronPlatform, electronArchitecture) {
    const base = `electron-v${electronVersion}-${electronPlatform}-${electronArchitecture}`;
    const archive = `${base}.zip`;
    const sourceFile = `https://github.com/electron/electron/releases/download/v${electronVersion}/${archive}`;
    const tmpFile = path.resolve(os.tmpdir(), archive);
    const electronDir = path.resolve(os.tmpdir(), base.replace(/^electron/i, pkgConfig.name));
    try {
        await fs.access(tmpFile);
    } catch (error) {
        console.log('Downloading:', sourceFile, '=>', '$TMP/' + path.basename(tmpFile));
        await download(sourceFile, tmpFile);
    }
    console.log('Extracting:', '$TMP/' + path.basename(tmpFile), '=>', '$TMP/' + path.basename(electronDir));
    await fs.rm(electronDir, { force: true, recursive: true });
    await extract(tmpFile, { dir: electronDir });
    return electronDir;
}

let dirElectron;
await fs.mkdir(dirOut, { recursive: true });

if (process.platform === 'darwin') {
    dirElectron = await redist(electronVersion, process.platform, 'x64');
    await (await import('./bundle-app-dmg.mjs')).bundle(dirApp, dirElectron, dirRes, dirOut);
    dirElectron = await redist(electronVersion, process.platform, 'arm64');
    await (await import('./bundle-app-dmg.mjs')).bundle(dirApp, dirElectron, dirRes, dirOut);
}

if (process.platform === 'win32') {
    dirElectron = await redist(electronVersion, process.platform, 'ia32');
    //await (await import('./bundle-app-zip.mjs')).bundle(dirApp, dirElectron, dirRes, dirOut);
    //dirElectron = await redist(electronVersion, process.platform, 'ia32');
    //await (await import('./bundle-app-iss.mjs')).bundle(dirApp, dirElectron);
    dirElectron = await redist(electronVersion, process.platform, 'x64');
    //await (await import('./bundle-app-zip.mjs')).bundle(dirApp, dirElectron, dirRes, dirOut);
    //dirElectron = await redist(electronVersion, process.platform, 'x64');
    //await (await import('./bundle-app-iss.mjs')).bundle(dirApp, dirElectron);
}

if (process.platform === 'linux') {
    /*
    dirElectron = await redist(electronVersion, 'linux', 'ia32');
    await (await import('./bundle-app-deb.mjs')).bundle(dirApp, dirElectron);
    dirElectron = await redist(electronVersion, 'linux', 'ia32');
    await (await import('./bundle-app-rpm.mjs')).bundle(dirApp, dirElectron);
    dirElectron = await redist(electronVersion, 'linux', 'ia32');
    await (await import('./bundle-app-tgz.mjs')).bundle(dirApp, dirElectron);
    dirElectron = await redist(electronVersion, 'linux', 'x64');
    await (await import('./bundle-app-deb.mjs')).bundle(dirApp, dirElectron);
    dirElectron = await redist(electronVersion, 'linux', 'x64');
    await (await import('./bundle-app-rpm.mjs')).bundle(dirApp, dirElectron);
    dirElectron = await redist(electronVersion, 'linux', 'x64');
    await (await import('./bundle-app-tgz.mjs')).bundle(dirApp, dirElectron);
    */
}