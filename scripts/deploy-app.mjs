import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import decompress from 'decompress';
import { download } from './tools.mjs';

const pkgFile = 'package.json';
const pkgConfig = await fs.readJSON(pkgFile);
const dirApp = path.join('.', 'build.app');
const dirDeploy = path.join('.', 'deploy');

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
    const tmpFile = path.join(os.tmpdir(), archive);
    const tmpDir = path.join(os.tmpdir(), base);
    const nwDir = path.join(os.tmpdir(), base.replace(/^nwjs(-sdk)?/i, 'hakuneko'));
    try {
        await fs.access(tmpFile);
    } catch(error) {
        console.log('Downloading:', sourceFile, '=>', '$TMP/' + path.basename(tmpFile));
        await download(sourceFile, tmpFile);
    }
    console.log('Extracting:', '$TMP/' + path.basename(tmpFile), '=>', '$TMP/' + path.basename(nwDir));
    await fs.rmdir(tmpDir, { recursive: true });
    await fs.rmdir(nwDir, { recursive: true });
    await decompress(tmpFile, os.tmpdir());
    await fs.move(tmpDir, nwDir);
    return nwDir;
}

let dirNW;
await fs.mkdir(dirDeploy, { recursive: true });

if(process.platform === 'darwin') {
    dirNW = await redist(nwVersion, nwBuildType, 'osx', 'x64');
    await (await import('./bundle-app-dmg.mjs')).bundle(dirApp, dirNW);
}

if(process.platform === 'win32') {
    dirNW = await redist(nwVersion, nwBuildType, 'win', 'ia32');
    await (await import('./bundle-app-zip.mjs')).bundle(dirApp, dirNW);
    //dirNW = await redist(nwVersion, nwBuildType, 'win', 'ia32');
    //await (await import('./bundle-app-iss.mjs')).bundle(dirApp, dirNW);
    dirNW = await redist(nwVersion, nwBuildType, 'win', 'x64');
    await (await import('./bundle-app-zip.mjs')).bundle(dirApp, dirNW);
    //dirNW = await redist(nwVersion, nwBuildType, 'win', 'x64');
    //await (await import('./bundle-app-iss.mjs')).bundle(dirApp, dirNW);
}

if(process.platform === 'linux') {
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