import path from 'node:path';
import fs from 'node:fs/promises';
import { run } from '../../tools.mjs';

const pkgFile = 'package.json';
const pkgConfig = JSON.parse(await fs.readFile(pkgFile));

/**
 * Bundle Snap Image for Linux
 * See: ...
 */
export async function bundle(blinkApplicationSourceDirectory, blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
    await bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory);
    await updateBinary(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory);
    // TODO: include ffmpeg
    // TODO: include imagemagick
    // TODO: include kindlegen
    await createSnapImage(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory);
}

async function bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory) {
    const target = path.join(blinkDeploymentTemporaryDirectory, 'resources', 'app');
    await fs.cp(blinkApplicationSourceDirectory, target, { recursive: true });
}

async function updateBinary(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory) {
    const binary = path.join(blinkDeploymentTemporaryDirectory, 'electron');
    await fs.rename(binary, binary.replace(/electron$/i, `${pkgConfig.name}`));
}

async function createSnapImage(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
    const snapfile = path.basename(blinkDeploymentTemporaryDirectory).replace(/^electron/i, pkgConfig.name) + '.snap';
    try {
        const artifact = path.join(blinkDeploymentOutputDirectory, snapfile);
        await fs.unlink(artifact);
    } catch { }
    const yaml = await createSnapcraftYaml(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory);
    try {
        await run('sudo snapcraft pack --destructive-mode', blinkDeploymentOutputDirectory);
        await run(`sudo mv ${pkgConfig.name}*.snap ${snapfile}`, blinkDeploymentOutputDirectory);
        await run('snapcraft upload *.snap --release=edge', blinkDeploymentOutputDirectory);
    } finally {
        fs.unlink(yaml);
    }
}

async function createSnapcraftYaml(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
    const file = path.join(blinkDeploymentOutputDirectory, 'snapcraft.yaml');
    await fs.writeFile(file, `
name: ${pkgConfig.name}
version: ${pkgConfig.devDependencies.electron}
summary: ${pkgConfig.title}
description: |
  ${pkgConfig.description}
base: core24
grade: devel
confinement: strict

plugs:
  dbus:
    bus: session
    name: org.freedesktop.portal.Desktop

apps:
  ${pkgConfig.name}:
    command: ${pkgConfig.name} --no-sandbox
    # TODO: Create desktop entry
    #desktop: snap/gui/${pkgConfig.name}.desktop
    extensions: [gnome]
    plugs:
    - home
    - network
    - network-bind
    - browser-support
    - dbus
    environment:
      # Correct the TMPDIR path for Chromium Framework/Electron to ensure
      # libappindicator has readable resources.
      TMPDIR: $XDG_RUNTIME_DIR

parts:
  ${pkgConfig.name}:
    source: .
    plugin: nil
    override-build: |
      cp -rv ${blinkDeploymentTemporaryDirectory}/* $SNAPCRAFT_PART_INSTALL/
      chmod -R 755 $SNAPCRAFT_PART_INSTALL
    build-snaps:
    - node/22/stable
    build-packages:
    - unzip
    stage-packages:
    - libnss3
    - libnspr4
`);
    return file;
}