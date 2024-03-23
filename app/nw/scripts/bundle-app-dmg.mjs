import path from 'path';
import fs from 'fs-extra';
import plist from 'plist';
import { run, wait } from '../../tools.mjs';

const pkgFile = 'package.json';
const pkgConfig = await fs.readJSON(pkgFile);
const product = pkgConfig.title;

/**
 * Bundle AppleDisk Image for MacOS
 * See: https://docs.nwjs.io/en/latest/For%20Users/Package%20and%20Distribute/#platform-specific-steps
 */
export async function bundle(dirApp, dirNW, dirRes, dirOut) {
    await bundleApp(dirApp, dirNW);
    await replaceIcons(dirNW, dirRes);
    await replacePlist(dirNW);
    // TODO: include ffmpeg
    // TODO: include imagemagick
    // TODO: include kindlegen
    await cleanupNW(dirNW);
    await createDiskImage(dirNW, dirRes, dirOut);
}

async function bundleApp(dirApp, dirNW) {
    const target = path.join(dirNW, 'nwjs.app', 'Contents', 'Resources', 'app.nw');
    await fs.copy(dirApp, target);
}

async function replaceIcons(dirNW, dirRes) {
    const source = path.join(dirRes, process.platform, 'app.iconset');
    const target = path.join(dirNW, 'nwjs.app', 'Contents', 'Resources', 'app.icns');
    await run(`iconutil --convert icns --output '${target}' '${source}'`);
}

async function replacePlist(dirNW) {
    const binary = path.join(dirNW, 'nwjs.app', 'Contents', 'MacOS', 'nwjs');
    const file = path.join(dirNW, 'nwjs.app', 'Contents', 'Info.plist');
    const xml = await fs.readFile(file, 'utf8');
    const meta = plist.parse(xml);
    meta.CFBundleExecutable = pkgConfig.name;
    meta.CFBundleName = pkgConfig.title;
    meta.CFBundleDisplayName = pkgConfig.title;
    meta.CFBundleIdentifier = pkgConfig.name;
    //meta.CFBundleVersion = ''; // 4472.77 => ???
    //meta.CFBundleShortVersionString = ''; // 91.0.4472.77 => ???
    await fs.writeFile(file, plist.build(meta), 'utf8');
    await fs.move(binary, binary.replace(/nwjs$/i, pkgConfig.name));
}

async function cleanupNW(dirNW) {
    const entries = await fs.readdir(dirNW);
    for(const entry of entries.filter(entry => entry !== 'nwjs.app')) {
        await fs.unlink(path.join(dirNW, entry));
    }
    try {
        await fs.unlink(dirNW + '.dmg');
    } catch(error) {/**/}
    await fs.move(path.join(dirNW, 'nwjs.app'), path.join(dirNW, product + '.app'));
    // HACK: Workaround for https://github.com/nwjs/nw.js/issues/8157
    await run(`xattr -cr '${path.join(dirNW, product + '.app')}'`);
}

async function createDiskImage(dirNW, dirRes, dirOut) {
    const poster = path.join(dirRes, process.platform, 'setup.png');
    const osascript = path.join(dirRes, process.platform, 'setup.scpt');
    await fs.copy(poster, path.join(dirNW, '.images', 'setup.png'));
    await run(`hdiutil create -volname '${product}' -srcfolder '${dirNW}' -fs 'HFS+' -fsargs '-c c=64,a=16,e=16' -format 'UDRW' '${dirNW}'`);
    await run(`hdiutil attach -readwrite -noverify -noautoopen '${dirNW}.dmg'`);
    await wait(5000);
    await run(`osascript '${osascript}'`);
    await run('sync');
    await wait(5000);
    await run(`hdiutil detach '/Volumes/${product}'`);
    await wait(5000);
    const artifact = path.join(dirOut, path.basename(dirNW).replace(/^nwjs(-sdk)?/i, pkgConfig.name) + '.dmg');
    try {
        await fs.unlink(artifact);
    } catch(error) {/**/}
    console.log('FINAL:', `hdiutil convert '${dirNW}.dmg' -format 'UDZO' -imagekey zlib-level=9 -o '${artifact}'`);
    await run(`hdiutil convert '${dirNW}.dmg' -format 'UDZO' -imagekey zlib-level=9 -o '${artifact}'`);
}