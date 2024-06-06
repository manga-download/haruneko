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

const nwVersion = pkgConfig.devDependencies.nw.split('-').shift();
const nwBuildType = pkgConfig.devDependencies.nw.match(/(-sdk)?$/)[0];

/**
 * Download a redistributable archive of NW.js for the given parameters to the temp directory of the operating system.
 * Extract the content to the build directory which should be bundled for redistribution.
 * @param nwVersion ...
 * @param nwBuildType ...
 * @param nwPlatform ...
 * @param nwArchitecture ...
 */
async function redist(nwVersion, nwBuildType, nwPlatform, nwArchitecture) {
    const nwExtension = nwPlatform === 'linux' ? 'tar.gz' : 'zip';
    const base = `nwjs${nwBuildType}-v${nwVersion}-${nwPlatform}-${nwArchitecture}`;
    const archive = `${base}.${nwExtension}`;
    const sourceFile = `https://dl.nwjs.io/v${nwVersion}/${archive}`;
    const tmpFile = path.resolve(os.tmpdir(), archive);
    const tmpDir = path.resolve(os.tmpdir(), base);
    const nwDir = path.resolve(os.tmpdir(), base.replace(/^nwjs(-sdk)?/i, pkgConfig.name));
    try {
        await fs.access(tmpFile);
    } catch (error) {
        console.log('Downloading:', sourceFile, '=>', '$TMP/' + path.basename(tmpFile));
        await download(sourceFile, tmpFile);
    }
    console.log('Extracting:', '$TMP/' + path.basename(tmpFile), '=>', '$TMP/' + path.basename(nwDir));
    await fs.rm(tmpDir, { force: true, recursive: true });
    await fs.rm(nwDir, { force: true, recursive: true });
    await extract(tmpFile, { dir: os.tmpdir() });
    await fs.rename(tmpDir, nwDir);
    return nwDir;
}

let dirTemp;
await fs.mkdir(dirOut, { recursive: true });

if (process.platform === 'darwin') {
    const bundler = await import('./bundle-app-dmg.mjs');
    dirTemp = await redist(nwVersion, nwBuildType, 'osx', 'x64');
    await bundler.bundle(dirApp, dirRes, dirTemp, dirOut);
    dirTemp = await redist(nwVersion, nwBuildType, 'osx', 'arm64');
    await bundler.bundle(dirApp, dirRes, dirTemp, dirOut);
}

if (process.platform === 'win32') {
    const portable = await import('./bundle-app-zip.mjs');
    //const setup = await import('./bundle-app-iss.mjs');
    dirTemp = await redist(nwVersion, nwBuildType, 'win', 'ia32');
    await portable.bundle(dirApp, dirRes, dirTemp, dirOut);
    //dirTemp = await redist(nwVersion, nwBuildType, 'win', 'ia32');
    //await setup.bundle(dirApp, dirTemp);
    dirTemp = await redist(nwVersion, nwBuildType, 'win', 'x64');
    await portable.bundle(dirApp, dirRes, dirTemp, dirOut);
    //dirTemp = await redist(nwVersion, nwBuildType, 'win', 'x64');
    //await setup.bundle(dirApp, dirTemp);
}

if (process.platform === 'linux') {
    /*
    dirTemp = await redist(nwVersion, nwBuildType, 'linux', 'ia32');
    await (await import('./bundle-app-deb.mjs')).bundle(dirApp, dirTemp);
    dirTemp = await redist(nwVersion, nwBuildType, 'linux', 'ia32');
    await (await import('./bundle-app-rpm.mjs')).bundle(dirApp, dirTemp);
    dirTemp = await redist(nwVersion, nwBuildType, 'linux', 'ia32');
    await (await import('./bundle-app-tgz.mjs')).bundle(dirApp, dirTemp);
    dirTemp = await redist(nwVersion, nwBuildType, 'linux', 'x64');
    await (await import('./bundle-app-deb.mjs')).bundle(dirApp, dirTemp);
    dirTemp = await redist(nwVersion, nwBuildType, 'linux', 'x64');
    await (await import('./bundle-app-rpm.mjs')).bundle(dirApp, dirTemp);
    dirTemp = await redist(nwVersion, nwBuildType, 'linux', 'x64');
    await (await import('./bundle-app-tgz.mjs')).bundle(dirApp, dirTemp);
    */
}