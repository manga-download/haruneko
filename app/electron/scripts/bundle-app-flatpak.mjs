import path from 'node:path';
import fs from 'node:fs/promises';
import { run } from '../../tools.mjs';

const pkgFile = 'package.json';
const pkgConfig = JSON.parse(await fs.readFile(pkgFile));

/**
 * Bundle Flatpak Image for Linux
 * See: https://docs.flatpak.org/en/latest/
 */
export async function bundle(blinkApplicationSourceDirectory, blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
    await bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory);
    await updateBinary(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory);
    await prepareFlatpakBuild(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory);
    await createFlatpakImage(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory);
}

async function bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory) {
    const target = path.join(blinkDeploymentTemporaryDirectory, 'resources', 'app');
    await fs.cp(blinkApplicationSourceDirectory, target, { recursive: true });
}

async function updateBinary(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory) {
    const binary = path.join(blinkDeploymentTemporaryDirectory, 'electron');
    await fs.rename(binary, binary.replace(/electron$/i, `${pkgConfig.name}`));
}

async function prepareFlatpakBuild(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory) {
    const linuxResources = path.join(blinkApplicationResourcesDirectory, 'linux');
    
    // Copy desktop file
    await fs.copyFile(
        path.join(linuxResources, 'org.hakuneko.HakuNeko.desktop'),
        path.join(blinkDeploymentTemporaryDirectory, 'org.hakuneko.HakuNeko.desktop')
    );
    
    // Copy metainfo file
    await fs.copyFile(
        path.join(linuxResources, 'org.hakuneko.HakuNeko.metainfo.xml'),
        path.join(blinkDeploymentTemporaryDirectory, 'org.hakuneko.HakuNeko.metainfo.xml')
    );
    
    // Copy icon files
    const iconSizes = ['16x16', '24x24', '32x32', '48x48', '64x64', '96x96', '128x128', '256x256'];
    for (const size of iconSizes) {
        await fs.copyFile(
            path.join(linuxResources, `icon_${size}.png`),
            path.join(blinkDeploymentTemporaryDirectory, `icon_${size}.png`)
        );
    }
}

async function createFlatpakImage(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
    const flatpakfile = path.basename(blinkDeploymentTemporaryDirectory).replace(/^electron/i, pkgConfig.name) + '.flatpak';
    try {
        const artifact = path.join(blinkDeploymentOutputDirectory, flatpakfile);
        await fs.unlink(artifact);
    } catch { }
    
    const manifest = path.join(blinkDeploymentTemporaryDirectory, 'org.hakuneko.HakuNeko.yml');
    const linuxResources = path.join('..', 'res', 'linux');
    
    // Copy the manifest to the temporary directory
    await fs.copyFile(
        path.join(linuxResources, 'org.hakuneko.HakuNeko.yml'),
        manifest
    );
    
    try {
        // Build the flatpak
        await run(`flatpak-builder --force-clean --repo=repo build-dir ${manifest}`, blinkDeploymentTemporaryDirectory);
        // Create single-file bundle
        await run(`flatpak build-bundle repo ${flatpakfile} org.hakuneko.HakuNeko`, blinkDeploymentTemporaryDirectory);
        // Move to output directory
        await run(`mv ${flatpakfile} ${blinkDeploymentOutputDirectory}/`, blinkDeploymentTemporaryDirectory);
    } finally {
        // Cleanup
        try {
            await fs.rm(path.join(blinkDeploymentTemporaryDirectory, 'build-dir'), { recursive: true, force: true });
            await fs.rm(path.join(blinkDeploymentTemporaryDirectory, 'repo'), { recursive: true, force: true });
            await fs.unlink(manifest);
        } catch { }
    }
}
