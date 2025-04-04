import path from 'node:path';
import fs from 'node:fs/promises';
import plist from 'plist';
import { run, wait } from '../../tools.mjs';

const pkgFile = 'package.json';
const pkgConfig = JSON.parse(await fs.readFile(pkgFile));
const product = pkgConfig.title;

/**
 * Bundle AppleDisk Image for MacOS
 * See: https://docs.nwjs.io/en/latest/For%20Users/Package%20and%20Distribute/#platform-specific-steps
 */
export async function bundle(blinkApplicationSourceDirectory, blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
    await bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory);
    await replaceIcons(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory);
    await replacePlist(blinkDeploymentTemporaryDirectory);
    // TODO: include ffmpeg
    // TODO: include imagemagick
    // TODO: include kindlegen
    await cleanup(blinkDeploymentTemporaryDirectory);
    await createDiskImage(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory);
}

async function bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory) {
    const target = path.join(blinkDeploymentTemporaryDirectory, 'nwjs.app', 'Contents', 'Resources', 'app.nw');
    await fs.cp(blinkApplicationSourceDirectory, target, { recursive: true });
}

async function replaceIcons(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory) {
    const source = path.join(blinkApplicationResourcesDirectory, process.platform, 'app.iconset');
    const target = path.join(blinkDeploymentTemporaryDirectory, 'nwjs.app', 'Contents', 'Resources', 'app.icns');
    await run(`iconutil --convert icns --output '${target}' '${source}'`);
}

async function replacePlist(blinkDeploymentTemporaryDirectory) {
    const binary = path.join(blinkDeploymentTemporaryDirectory, 'nwjs.app', 'Contents', 'MacOS', 'nwjs');
    const file = path.join(blinkDeploymentTemporaryDirectory, 'nwjs.app', 'Contents', 'Info.plist');
    const xml = await fs.readFile(file, 'utf8');
    const meta = plist.parse(xml);
    meta.CFBundleExecutable = pkgConfig.name;
    meta.CFBundleName = pkgConfig.title;
    meta.CFBundleDisplayName = pkgConfig.title;
    meta.CFBundleIdentifier = pkgConfig.name;
    //meta.CFBundleVersion = ''; // 4472.77 => ???
    //meta.CFBundleShortVersionString = ''; // 91.0.4472.77 => ???
    await fs.writeFile(file, plist.build(meta), 'utf8');
    await fs.rename(binary, binary.replace(/nwjs$/i, pkgConfig.name));
}

async function cleanup(blinkDeploymentTemporaryDirectory) {
    const entries = await fs.readdir(blinkDeploymentTemporaryDirectory);
    for(const entry of entries.filter(entry => entry !== 'nwjs.app')) {
        await fs.unlink(path.join(blinkDeploymentTemporaryDirectory, entry));
    }
    try {
        await fs.unlink(blinkDeploymentTemporaryDirectory + '.dmg');
    } catch(error) {/**/}
    await fs.rename(path.join(blinkDeploymentTemporaryDirectory, 'nwjs.app'), path.join(blinkDeploymentTemporaryDirectory, product + '.app'));
    // NOTE: Unfortunately the following commands will probably not affect the distributed disk image
    await run(`xattr -r -c '${path.join(blinkDeploymentTemporaryDirectory, product + '.app')}'`);
    await run(`chmod -R +X  '${path.join(blinkDeploymentTemporaryDirectory, product + '.app')}'`);
}

async function createDiskImage(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
    const poster = path.join(blinkApplicationResourcesDirectory, process.platform, 'setup.png');
    const osascript = path.join(blinkApplicationResourcesDirectory, process.platform, 'setup.scpt');
    await fs.cp(poster, path.join(blinkDeploymentTemporaryDirectory, '.images', 'setup.png'));
    await run(`hdiutil create -volname '${product}' -srcfolder '${blinkDeploymentTemporaryDirectory}' -fs 'HFS+' -fsargs '-c c=64,a=16,e=16' -format 'UDRW' '${blinkDeploymentTemporaryDirectory}'`);
    await run(`hdiutil attach -readwrite -noverify -noautoopen '${blinkDeploymentTemporaryDirectory}.dmg'`);
    await wait(5000);
    await run(`osascript '${osascript}'`);
    await run('sync');
    await wait(5000);
    await run(`hdiutil detach '/Volumes/${product}'`);
    await wait(5000);
    const artifact = path.join(blinkDeploymentOutputDirectory, path.basename(blinkDeploymentTemporaryDirectory).replace(/^nwjs(-sdk)?/i, pkgConfig.name) + '.dmg');
    try {
        await fs.unlink(artifact);
    } catch(error) {/**/}
    console.log('FINAL:', `hdiutil convert '${blinkDeploymentTemporaryDirectory}.dmg' -format 'UDZO' -imagekey zlib-level=9 -o '${artifact}'`);
    await run(`hdiutil convert '${blinkDeploymentTemporaryDirectory}.dmg' -format 'UDZO' -imagekey zlib-level=9 -o '${artifact}'`);
}