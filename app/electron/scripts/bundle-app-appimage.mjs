import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { download, run } from '../../tools.mjs';

const pkgFile = 'package.json';
const pkgConfig = JSON.parse(await fs.readFile(pkgFile));
const appimagetoolVersion = '1.9.1';

/**
 * Bundle AppImage for Linux
 * See: https://docs.appimage.org/packaging-guide/manual.html
 */
export async function bundle(blinkApplicationSourceDirectory, blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
    await bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory);
    await updateBinary(blinkDeploymentTemporaryDirectory);
    await addDesktopIntegration(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory);
    // TODO: include ffmpeg
    // TODO: include imagemagick
    // TODO: include kindlegen
    await createAppImage(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory);
}

async function bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory) {
    const target = path.join(blinkDeploymentTemporaryDirectory, 'resources', 'app');
    await fs.cp(blinkApplicationSourceDirectory, target, { recursive: true });
}

async function updateBinary(blinkDeploymentTemporaryDirectory) {
    const binary = path.join(blinkDeploymentTemporaryDirectory, 'electron');
    await fs.rename(binary, binary.replace(/electron$/i, `${pkgConfig.name}`));
}

async function addDesktopIntegration(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory) {
    const desktop = path.join(blinkApplicationResourcesDirectory, 'linux', `${pkgConfig.name}.desktop`);
    await fs.copyFile(desktop, path.join(blinkDeploymentTemporaryDirectory, `${pkgConfig.name}.desktop`));
    const icon = path.join(blinkApplicationResourcesDirectory, 'linux', `${pkgConfig.name}.png`);
    await fs.copyFile(icon, path.join(blinkDeploymentTemporaryDirectory, `${pkgConfig.name}.png`));
    // The AppImage mount is nosuid, so the chrome-sandbox helper cannot be used (same workaround as the Snap package)
    const appRun = `#!/bin/sh
HERE="$(dirname "$(readlink -f "$0")")"
exec "$HERE/${pkgConfig.name}" --no-sandbox "$@"
`;
    await fs.writeFile(path.join(blinkDeploymentTemporaryDirectory, 'AppRun'), appRun, { mode: 0o755 });
}

async function createAppImage(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
    const name = path.basename(blinkDeploymentTemporaryDirectory).replace(/^electron/i, pkgConfig.name);
    const artifact = path.resolve(blinkDeploymentOutputDirectory, `${name}.AppImage`);
    try {
        await fs.unlink(artifact);
    } catch { }
    const appimagetool = await getAppImageTool();
    console.log('FINAL:', appimagetool, blinkDeploymentTemporaryDirectory, '=>', artifact);
    await run(`ARCH=x86_64 "${appimagetool}" --appimage-extract-and-run --no-appstream "${blinkDeploymentTemporaryDirectory}" "${artifact}"`);
}

async function getAppImageTool() {
    const file = path.resolve(os.tmpdir(), `appimagetool-${appimagetoolVersion}-x86_64.AppImage`);
    try {
        await fs.access(file);
    } catch {
        const sourceFile = `https://github.com/AppImage/appimagetool/releases/download/${appimagetoolVersion}/appimagetool-x86_64.AppImage`;
        console.log('Downloading:', sourceFile, '=>', '$TMP/' + path.basename(file));
        await download(sourceFile, file);
    }
    return file;
}
