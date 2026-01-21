import path from 'node:path';
import fs from 'node:fs/promises';
import { run } from '../../tools.mjs';

const pkgFile = 'package.json';
const pkgConfig = JSON.parse(await fs.readFile(pkgFile));

/**
 * Bundle Flatpak Image for Linux
 * See: ...
 */
export async function bundle(blinkApplicationSourceDirectory, blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory, targetArchitecture) {
    await bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory);
    await updateBinary(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory);
    // TODO: include ffmpeg
    // TODO: include imagemagick
    // TODO: include kindlegen
    await createFlatpakImage(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory, targetArchitecture === 'x64' ? 'x86_64' : 'aarch64');
}

async function bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory) {
    const target = path.join(blinkDeploymentTemporaryDirectory, 'resources', 'app');
    await fs.cp(blinkApplicationSourceDirectory, target, { recursive: true });
}

async function updateBinary(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory) {
    const binary = path.join(blinkDeploymentTemporaryDirectory, 'electron');
    await fs.rename(binary, binary.replace(/electron$/i, `${pkgConfig.name}`));
}

async function createFlatpakImage(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory, flatpakArchitecture) {
    const flatpak = path.basename(blinkDeploymentTemporaryDirectory).replace(/^electron/i, pkgConfig.name) + '.flatpak';
    try {
        const artifact = path.join(blinkDeploymentOutputDirectory, flatpak);
        await fs.unlink(artifact);
    } catch { }
    const yaml = await createFlatpakManifest(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory);
    try {
        await run(`flatpak-builder ./build ./manifest.yaml --repo=./repo --arch=${flatpakArchitecture} --install-deps-from=flathub --force-clean`, blinkDeploymentOutputDirectory);
        await run(`flatpak build-bundle --arch=${flatpakArchitecture} ./repo ${flatpak} app.${pkgConfig.name.replace('-', '.')}`, blinkDeploymentOutputDirectory);
        // flatpak install app.hakuneko.electron
        // flatpak run app.hakuneko.electron
        //await run(`sudo mv ${pkgConfig.name}*.snap ${flatpak}`, blinkDeploymentOutputDirectory);
        //await run('snapcraft upload *.flatpak --release=edge', blinkDeploymentOutputDirectory);
    } finally {
        fs.unlink(yaml);
    }
}

async function createFlatpakManifest(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
    const file = path.join(blinkDeploymentOutputDirectory, 'manifest.yaml');
    await fs.writeFile(file, `
app-id: app.${pkgConfig.name.replace('-', '.')}
version: ${pkgConfig.devDependencies.electron}
command: /app/bin/${pkgConfig.name}
runtime: org.freedesktop.Platform
runtime-version: '25.08'
sdk: org.freedesktop.Sdk
finish-args:
  - --device=dri
  - --socket=wayland
  - --socket=fallback-x11
  - --socket=pulseaudio
  - --share=ipc
  - --share=network
  - --filesystem=home
  - --env=ELECTRON_TRASH=gio
  # required to fix cursor scaling on wayland
  - --env=XCURSOR_PATH=/run/host/user-share/icons:/run/host/share/icons
modules:
  - name: ${pkgConfig.name}
    buildsystem: simple
    build-commands:
      - mkdir -p /app/share/hakuneko
      - cp -rv . /app/share/hakuneko
      - |
        install -Dm755 /dev/stdin /app/bin/${pkgConfig.name} << 'EOF'
        #!/bin/sh
        exec /app/share/hakuneko/${pkgConfig.name} --no-sandbox "$@"
        EOF
    sources:
      - type: dir
        path: ${blinkDeploymentTemporaryDirectory}
`);
    return file;
}