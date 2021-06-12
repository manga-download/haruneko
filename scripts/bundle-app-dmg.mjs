import path from 'path';
import fs from 'fs-extra';
import plist from 'plist';
import { run, wait } from './tools.mjs';

const product = 'HakuNeko';

/**
 * Bundle AppleDisk Image for MacOS
 * See: https://docs.nwjs.io/en/latest/For%20Users/Package%20and%20Distribute/#platform-specific-steps
 */
export async function bundle(dirApp, dirNW) {
    await bundleApp(dirApp, dirNW);
    await replaceIcons(dirNW);
    await replacePlist(dirNW);
    // TODO: include ffmpeg
    // TODO: include imagemagick
    // TODO: include kindlegen
    await cleanupNW(dirNW);
    await createDiskImage(dirNW);
}

async function bundleApp(dirApp, dirNW) {
    const target = path.join(dirNW, 'nwjs.app', 'Contents', 'Resources', 'app.nw');
    await fs.copy(dirApp, target);
}

async function replaceIcons(dirNW) {
    const source = path.join('.', 'dist', process.platform, 'app.iconset');
    const target = path.join(dirNW, 'nwjs.app', 'Contents', 'Resources', 'app.icns');
    await run(`iconutil --convert icns --output '${target}' '${source}'`);
}

async function replacePlist(dirNW) {
    const file = path.join(dirNW, 'nwjs.app', 'Contents', 'Info.plist');
    const xml = await fs.readFile(file, 'utf8');
    const meta = plist.parse(xml);
    console.log('PList Entries:',
        meta.CFBundleExecutable, // nwjs => HakuNeko
        meta.CFBundleName, // nwjs => HakuNeko Desktop
        meta.CFBundleDisplayName, // nwjs => HakuNeko Desktop
        meta.CFBundleIdentifier, // io.nwjs.nwjs => https://git.io/hakuneko
        meta.CFBundleVersion, // 4472.77 => ???
        meta.CFBundleShortVersionString // 91.0.4472.77 => ???
    );
}

async function cleanupNW(dirNW) {
    const entries = await fs.readdir(dirNW);
    for(const entry of entries.filter(entry => entry !== 'nwjs.app')) {
        await fs.unlink(path.join(dirNW, entry));
    }
    try {
        await fs.unlink(dirNW + '.dmg');
    } catch(error) {/**/}
    try {
        const artifact = path.join('.', 'deploy', dirNW.split('/').pop().replace(/^nwjs(-sdk)?/i, 'hakuneko') + '.dmg');
        await fs.unlink(artifact);
    } catch(error) {/**/}
    await fs.move(path.join(dirNW, 'nwjs.app'), path.join(dirNW, product + '.app'));
}

async function createDiskImage(dirNW) {
    const poster = path.join('.', 'dist', process.platform, 'setup.png');
    const osascript = path.join('.', 'dist', process.platform, 'setup.scpt');
    await fs.copy(poster, path.join(dirNW, '.images', 'setup.png'));
    await run(`hdiutil create -volname '${product}' -srcfolder '${dirNW}' -fs 'HFS+' -fsargs '-c c=64,a=16,e=16' -format 'UDRW' '${dirNW}'`);
    await run(`hdiutil attach -readwrite -noverify -noautoopen '${dirNW}.dmg'`);
    await wait(5000);
    await run(`osascript '${osascript}'`);
    await run('sync');
    await wait(5000);
    await run(`hdiutil detach '/Volumes/${product}'`);
    await wait(5000);
    const artifact = path.join('.', 'deploy', dirNW.split('/').pop().replace(/^nwjs(-sdk)?/i, 'hakuneko') + '.dmg');
    await run(`hdiutil convert '${dirNW}.dmg' -format 'UDZO' -imagekey zlib-level=9 -o '${artifact}'`);
}