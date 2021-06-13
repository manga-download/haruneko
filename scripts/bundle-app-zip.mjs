import path from 'path';
import fs from 'fs-extra';
import { run } from './tools.mjs';

/**
 * Bundle Portable Binary for Windows
 * See: https://docs.nwjs.io/en/latest/For%20Users/Package%20and%20Distribute/#platform-specific-steps
 */
export async function bundle(dirApp, dirNW) {
    await bundleApp(dirApp, dirNW);
    await makePortable(dirNW);
    await updateBinary(dirNW);
    // TODO: include ffmpeg
    // TODO: include imagemagick
    // TODO: include kindlegen
    await createZipArchive(dirNW);
}

async function bundleApp(dirApp, dirNW) {
    const target = path.join(dirNW, 'package.nw');
    await fs.copy(dirApp, target);
}

async function makePortable(dirNW) {
    const userdata = path.join(dirNW, 'userdata');
    await fs.mkdir(userdata, { recursive: true });
    const pkgfile = path.join(dirNW, 'package.nw', 'package.json');
    const pkg = await fs.readJSON(pkgfile);
    pkg['chromium-args'] += ' --user-data-dir=userdata';
    await fs.writeJSON(pkgfile, pkg, { spaces: 4 });
}

async function updateBinary(dirNW) {
    const binary = path.join(dirNW, 'nw.exe');
    const icon = path.join('.', 'dist', process.platform, 'app.ico');
    const rcedit = path.join('.', 'dist', process.platform, 'rcedit64.exe');
    const command = [
        rcedit,
        `"${binary}"`,
        `--set-version-string "ProductName" "HakuNeko"`,
        `--set-version-string "CompanyName" ""`,
        `--set-version-string "LegalCopyright" "${new Date().getFullYear()}"`,
        `--set-version-string "FileDescription" "Manga, Anime & Novel Downloader"`,
        `--set-version-string "InternalName" ""`,
        `--set-version-string "OriginalFilename" "hakuneko.exe"`,
        //`--set-file-version "0.54.0"`,
        //`--set-product-version "0.54.0"`,
        `--set-icon "${icon}"`
    ].join(' ');
    await run(command);
    await fs.move(binary, binary.replace(/nw\.exe$/i, 'hakuneko.exe'));
}

async function createZipArchive(dirNW) {
    const artifact = path.join('.', 'deploy', path.basename(dirNW).replace(/^nwjs(-sdk)?/i, 'hakuneko') + '.zip');
    try {
        await fs.unlink(artifact);
    } catch(error) {/**/}
    const command = `powershell "Compress-Archive '${dirNW}' '${artifact}'"`;
    await run(command);
}