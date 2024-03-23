import path from 'path';
import fs from 'fs-extra';
import { run } from '../../tools.mjs';

const pkgFile = 'package.json';
const pkgConfig = await fs.readJSON(pkgFile);

/**
 * Bundle Portable Binary for Windows
 * See: https://docs.nwjs.io/en/latest/For%20Users/Package%20and%20Distribute/#platform-specific-steps
 */
export async function bundle(dirApp, dirNW, dirRes, dirOut) {
    await bundleApp(dirApp, dirNW);
    await makePortable(dirNW);
    await updateBinary(dirNW, dirRes);
    // TODO: include ffmpeg
    // TODO: include imagemagick
    // TODO: include kindlegen
    await createZipArchive(dirNW, dirOut);
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

async function updateBinary(dirNW, dirRes) {
    const binary = path.join(dirNW, 'nw.exe');
    const icon = path.join(dirRes, process.platform, 'app.ico');
    const rcedit = path.join(dirRes, process.platform, 'rcedit64.exe');
    const command = [
        rcedit,
        `"${binary}"`,
        `--set-version-string "ProductName" "${pkgConfig.title}"`,
        `--set-version-string "CompanyName" ""`,
        `--set-version-string "LegalCopyright" "${new Date().getFullYear()}"`,
        `--set-version-string "FileDescription" "${pkgConfig.description}"`,
        `--set-version-string "InternalName" ""`,
        `--set-version-string "OriginalFilename" "${pkgConfig.name}.exe"`,
        //`--set-file-version "0.54.0"`,
        //`--set-product-version "0.54.0"`,
        `--set-icon "${icon}"`
    ].join(' ');
    await run(command);
    await fs.move(binary, binary.replace(/nw\.exe$/i, `${pkgConfig.name}.exe`));
}

async function createZipArchive(dirNW, dirOut) {
    const artifact = path.join(dirOut, path.basename(dirNW).replace(/^nwjs(-sdk)?/i, pkgConfig.name) + '.zip');
    try {
        await fs.unlink(artifact);
    } catch(error) {/**/}
    const command = `powershell "Compress-Archive '${dirNW}' '${artifact}'"`;
    await run(command);
}