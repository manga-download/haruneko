import path from 'node:path';
import fs from 'node:fs/promises';
import { run } from '../../tools.mjs';

const pkgFile = 'package.json';
const pkgConfig = JSON.parse(await fs.readFile(pkgFile));

/**
 * Bundle Portable Binary for Windows
 * See: https://docs.nwjs.io/en/latest/For%20Users/Package%20and%20Distribute/#platform-specific-steps
 */
export async function bundle(blinkApplicationSourceDirectory, blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
    await bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory);
    await makePortable(blinkDeploymentTemporaryDirectory);
    await updateBinary(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory);
    // TODO: include ffmpeg
    // TODO: include imagemagick
    // TODO: include kindlegen
    await createZipArchive(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory);
}

async function bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory) {
    const target = path.join(blinkDeploymentTemporaryDirectory, 'package.nw');
    await fs.cp(blinkApplicationSourceDirectory, target, { recursive: true });
}

async function makePortable(blinkDeploymentTemporaryDirectory) {
    const userdata = path.join(blinkDeploymentTemporaryDirectory, 'userdata');
    await fs.mkdir(userdata, { recursive: true });
    const pkgfile = path.join(blinkDeploymentTemporaryDirectory, 'package.nw', 'package.json');
    const pkg = await JSON.parse(await fs.readFile(pkgfile));
    pkg['chromium-args'] = pkg['chromium-args'] ? pkg['chromium-args'] + ' --user-data-dir=userdata' : '--user-data-dir=userdata';
    await fs.writeFile(pkgfile, JSON.stringify(pkg, null, 4));
}

async function updateBinary(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory) {
    const binary = path.join(blinkDeploymentTemporaryDirectory, 'nw.exe');
    const icon = path.join(blinkApplicationResourcesDirectory, process.platform, 'app.ico');
    const rcedit = path.join(blinkApplicationResourcesDirectory, process.platform, 'rcedit64.exe');
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
    await fs.rename(binary, binary.replace(/nw\.exe$/i, `${pkgConfig.name}.exe`));
}

async function createZipArchive(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
    const artifact = path.join(blinkDeploymentOutputDirectory, path.basename(blinkDeploymentTemporaryDirectory).replace(/^nwjs(-sdk)?/i, pkgConfig.name) + '.zip');
    try {
        await fs.unlink(artifact);
    } catch(error) {/**/}
    const command = `powershell "Compress-Archive '${blinkDeploymentTemporaryDirectory}' '${artifact}'"`;
    await run(command);
}