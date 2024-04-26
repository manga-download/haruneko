import path from 'node:path';
import fs from 'node:fs/promises';
import plist from 'plist';
import { run, wait } from '../../tools.mjs';

const pkgFile = 'package.json';
const pkgConfig = JSON.parse(await fs.readFile(pkgFile));
const product = pkgConfig.title;

/**
 * Bundle AppleDisk Image for MacOS
 * See: https://www.electronjs.org/docs/latest/tutorial/application-distribution#manual-packaging
 */
export async function bundle(dirApp, dirElectron, dirRes, dirOut) {
    await bundleApp(dirApp, dirElectron);
    await replaceIcons(dirElectron, dirRes);
    await replacePlist(dirElectron);
    // TODO: include ffmpeg
    // TODO: include imagemagick
    // TODO: include kindlegen
    await cleanup(dirElectron);
    await createDiskImage(dirElectron, dirRes, dirOut);
}

async function bundleApp(dirApp, dirElectron) {
    const target = path.join(dirElectron, 'Electron.app', 'Contents', 'Resources', 'app');
    await fs.cp(dirApp, target, { recursive: true });
}

async function replaceIcons(dirElectron, dirRes) {
    const source = path.join(dirRes, process.platform, 'app.iconset');
    const target = path.join(dirElectron, 'Electron.app', 'Contents', 'Resources', 'electron.icns');
    await run(`iconutil --convert icns --output '${target}' '${source}'`);
}

async function replacePlist(dirElectron) {
    const binary = path.join(dirElectron, 'Electron.app', 'Contents', 'MacOS', 'Electron');
    const file = path.join(dirElectron, 'Electron.app', 'Contents', 'Info.plist');
    const xml = await fs.readFile(file, 'utf8');
    const meta = plist.parse(xml);
    meta.CFBundleExecutable = pkgConfig.name;
    meta.CFBundleName = pkgConfig.title;
    meta.CFBundleDisplayName = pkgConfig.title;
    meta.CFBundleIdentifier = pkgConfig.name;
    await fs.writeFile(file, plist.build(meta), 'utf8');
    await fs.rename(binary, binary.replace(/Electron$/i, pkgConfig.name));
}

async function cleanup(dirElectron) {
    const entries = await fs.readdir(dirElectron);
    for(const entry of entries.filter(entry => entry !== 'Electron.app')) {
        await fs.unlink(path.join(dirElectron, entry));
    }
    try {
        await fs.unlink(dirElectron + '.dmg');
    } catch(error) {/**/}
    await fs.rename(path.join(dirElectron, 'Electron.app'), path.join(dirElectron, product + '.app'));
}

async function createDiskImage(dirElectron, dirRes, dirOut) {
    const poster = path.join(dirRes, process.platform, 'setup.png');
    const osascript = path.join(dirRes, process.platform, 'setup.scpt');
    await fs.cp(poster, path.join(dirElectron, '.images', 'setup.png'));
    await run(`hdiutil create -volname '${product}' -srcfolder '${dirElectron}' -fs 'HFS+' -fsargs '-c c=64,a=16,e=16' -format 'UDRW' '${dirElectron}'`);
    await run(`hdiutil attach -readwrite -noverify -noautoopen '${dirElectron}.dmg'`);
    await wait(5000);
    await run(`osascript '${osascript}'`);
    await run('sync');
    await wait(5000);
    await run(`hdiutil detach '/Volumes/${product}'`);
    await wait(5000);
    const artifact = path.join(dirOut, path.basename(dirElectron).replace(/^electron/i, pkgConfig.name) + '.dmg');
    try {
        await fs.unlink(artifact);
    } catch(error) {/**/}
    console.log('FINAL:', `hdiutil convert '${dirElectron}.dmg' -format 'UDZO' -imagekey zlib-level=9 -o '${artifact}'`);
    await run(`hdiutil convert '${dirElectron}.dmg' -format 'UDZO' -imagekey zlib-level=9 -o '${artifact}'`);
}