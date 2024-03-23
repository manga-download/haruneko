import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import extract from 'extract-zip';
import { download } from '../../tools.mjs';

const pkgFile = 'package.json';
const pkgConfig = await fs.readJSON(pkgFile);
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
    await fs.move(tmpDir, nwDir);
    return nwDir;
}

let dirNW;
await fs.mkdir(dirOut, { recursive: true });

if (process.platform === 'darwin') {
    dirNW = await redist(nwVersion, nwBuildType, 'osx', 'x64');
    await (await import('./bundle-app-dmg.mjs')).bundle(dirApp, dirNW, dirRes, dirOut);
    dirNW = await redist(nwVersion, nwBuildType, 'osx', 'arm64');
    await (await import('./bundle-app-dmg.mjs')).bundle(dirApp, dirNW, dirRes, dirOut);
}

if (process.platform === 'win32') {
    dirNW = await redist(nwVersion, nwBuildType, 'win', 'ia32');
    await (await import('./bundle-app-zip.mjs')).bundle(dirApp, dirNW, dirRes, dirOut);
    //dirNW = await redist(nwVersion, nwBuildType, 'win', 'ia32');
    //await (await import('./bundle-app-iss.mjs')).bundle(dirApp, dirNW);
    dirNW = await redist(nwVersion, nwBuildType, 'win', 'x64');
    await (await import('./bundle-app-zip.mjs')).bundle(dirApp, dirNW, dirRes, dirOut);
    //dirNW = await redist(nwVersion, nwBuildType, 'win', 'x64');
    //await (await import('./bundle-app-iss.mjs')).bundle(dirApp, dirNW);
}

if (process.platform === 'linux') {
    /*
    dirNW = await redist(nwVersion, nwBuildType, 'linux', 'ia32');
    await (await import('./bundle-app-deb.mjs')).bundle(dirApp, dirNW);
    dirNW = await redist(nwVersion, nwBuildType, 'linux', 'ia32');
    await (await import('./bundle-app-rpm.mjs')).bundle(dirApp, dirNW);
    dirNW = await redist(nwVersion, nwBuildType, 'linux', 'ia32');
    await (await import('./bundle-app-tgz.mjs')).bundle(dirApp, dirNW);
    dirNW = await redist(nwVersion, nwBuildType, 'linux', 'x64');
    await (await import('./bundle-app-deb.mjs')).bundle(dirApp, dirNW);
    dirNW = await redist(nwVersion, nwBuildType, 'linux', 'x64');
    await (await import('./bundle-app-rpm.mjs')).bundle(dirApp, dirNW);
    dirNW = await redist(nwVersion, nwBuildType, 'linux', 'x64');
    await (await import('./bundle-app-tgz.mjs')).bundle(dirApp, dirNW);
    */
}