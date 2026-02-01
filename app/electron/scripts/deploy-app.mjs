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

let dirTemp;
await fs.mkdir(dirOut, { recursive: true });

if (process.platform === 'darwin') {
    const bundler = await import('./bundle-app-dmg.mjs');
    dirTemp = await redist(electronVersion, process.platform, 'x64');
    await bundler.bundle(dirApp, dirRes, dirTemp, dirOut);
    dirTemp = await redist(electronVersion, process.platform, 'arm64');
    await bundler.bundle(dirApp, dirRes, dirTemp, dirOut);
}

if (process.platform === 'win32') {
    const portable = await import('./bundle-app-zip.mjs');
    //const setup = await import('./bundle-app-iss.mjs');
    dirTemp = await redist(electronVersion, process.platform, 'ia32');
    await portable.bundle(dirApp, dirRes, dirTemp, dirOut);
    //dirTemp = await redist(electronVersion, process.platform, 'ia32');
    //await setup.bundle(dirApp, dirTemp);
    dirTemp = await redist(electronVersion, process.platform, 'x64');
    await portable.bundle(dirApp, dirRes, dirTemp, dirOut);
    //dirTemp = await redist(electronVersion, process.platform, 'x64');
    //await setup.bundle(dirApp, dirTemp);
    dirTemp = await redist(electronVersion, process.platform, 'arm64');
    await portable.bundle(dirApp, dirRes, dirTemp, dirOut);
    //dirTemp = await redist(electronVersion, process.platform, 'arm64');
    //await setup.bundle(dirApp, dirTemp);
}

if (process.platform === 'linux') {
    const snap = await import('./bundle-app-snap.mjs');
    const flatpak = await import('./bundle-app-flatpak.mjs');
    dirTemp = await redist(electronVersion, process.platform, 'x64');
    await snap.bundle(dirApp, dirRes, dirTemp, dirOut);
    dirTemp = await redist(electronVersion, process.platform, 'x64');
    await flatpak.bundle(dirApp, dirRes, dirTemp, dirOut);
}