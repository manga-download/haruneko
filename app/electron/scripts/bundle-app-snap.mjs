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
    await createSnapImage(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory);
}

async function bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory) {
    const target = path.join(blinkDeploymentTemporaryDirectory, 'resources', 'app');
    await fs.cp(blinkApplicationSourceDirectory, target, { recursive: true });
}

async function updateBinary(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory) {
    const binary = path.join(blinkDeploymentTemporaryDirectory, 'electron');
    await fs.rename(binary, binary.replace(/electron$/i, `${pkgConfig.name}`));
}

async function createSnapImage(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
    const snapfile = path.basename(blinkDeploymentTemporaryDirectory).replace(/^electron/i, pkgConfig.name) + '.snap';
    const yaml = path.join(blinkDeploymentOutputDirectory, 'snapcraft.yaml');
    const desktop = path.join(blinkDeploymentOutputDirectory, 'snap', 'gui', `${pkgConfig.name}.desktop`);
    const icon = path.join(blinkDeploymentOutputDirectory, 'snap', 'gui', `${pkgConfig.name}.png`);
    await Promise.allSettled([path.join(blinkDeploymentOutputDirectory, snapfile), yaml, desktop, icon].map(file => fs.unlink(file)));
    await createSnapcraftYaml(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory);
    await createDesktopEntry(blinkApplicationResourcesDirectory, blinkDeploymentOutputDirectory);
    await run('sudo snapcraft pack --destructive-mode', blinkDeploymentOutputDirectory);
    await run(`sudo mv ${pkgConfig.name}*.snap ${snapfile}`, blinkDeploymentOutputDirectory);
    await run('snapcraft upload *.snap --release=edge', blinkDeploymentOutputDirectory);
}

async function createDesktopEntry(blinkApplicationResourcesDirectory, blinkDeploymentOutputDirectory) {
    const directory = path.join(blinkDeploymentOutputDirectory, 'snap', 'gui');
    await fs.mkdir(directory, { recursive: true });
    const file = path.join(directory, `${pkgConfig.name}.desktop`);
    // A desktop entry is mandatory for xdg-desktop-portal to register the snap,
    // otherwise all portal requests (e.g. the file chooser) are denied.
    // Field semantics follow hakuneko/build-app.config (meta.type, meta.categories),
    // except Icon which must be the absolute path of the icon file shipped in meta/gui.
    await fs.writeFile(file, `[Desktop Entry]
Version=1.0
Type=Application
Name=${pkgConfig.title}
GenericName=${pkgConfig.description}
Exec=${pkgConfig.name}
Icon=\${SNAP}/meta/gui/${pkgConfig.name}.png
Categories=Network;FileTransfer;
`);
    // Snapcraft copies snap/gui into meta/gui of the snap
    await fs.copyFile(path.join(blinkApplicationResourcesDirectory, process.platform, 'icon.png'), path.join(directory, `${pkgConfig.name}.png`));
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

apps:
  ${pkgConfig.name}:
    command: ${pkgConfig.name} --no-sandbox
    desktop: snap/gui/${pkgConfig.name}.desktop
    extensions: [gnome]
    plugs:
    - home
    - network
    - network-bind
    - browser-support
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
}