import path from 'node:path';
import fs from 'node:fs/promises';
import { run } from '../../tools.mjs';

const pkgFile = 'package.json';
const pkgConfig = JSON.parse(await fs.readFile(pkgFile));

/**
 * Bundle tar.gz for linux
 * See: https://www.electronjs.org/docs/latest/tutorial/application-distribution#manual-packaging
 */
export async function bundle(blinkApplicationSourceDirectory, blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
  await bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory);
  await makeIcons(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory);
  await makeDesktopEntry(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory);
  await updateBinary(blinkDeploymentTemporaryDirectory);
  // TODO: include ffmpeg
  // TODO: include imagemagick
  // TODO: include kindlegen
  await createTarball(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory);
}

async function bundleApp(blinkApplicationSourceDirectory, blinkDeploymentTemporaryDirectory) {
  const target = path.join(blinkDeploymentTemporaryDirectory, 'resources', 'app');
  await fs.cp(blinkApplicationSourceDirectory, target, { recursive: true });
}

async function makeIcons(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory) {
  const source = path.join(blinkApplicationResourcesDirectory, process.platform, 'app.ico');
  const target = path.join(blinkDeploymentTemporaryDirectory, 'resources', 'app.ico');
  await fs.cp(source, target);
}

async function makeDesktopEntry(blinkApplicationResourcesDirectory, blinkDeploymentTemporaryDirectory) {
  const sourceEntryText = path.join(blinkApplicationResourcesDirectory, process.platform, 'hakuneko.desktop');
  let entryText = await fs.readFile(sourceEntryText, 'utf8');

  entryText = entryText.replace("NameToReplace", pkgConfig.name);
  entryText = entryText.replace("descriptionToReplace", pkgConfig.description);

  const targetEntryFile = path.join(blinkDeploymentTemporaryDirectory, 'hakuneko-electron.desktop');
  await fs.writeFile(targetEntryFile, entryText);
}

async function updateBinary(blinkDeploymentTemporaryDirectory) {
  const binary = path.join(blinkDeploymentTemporaryDirectory, 'electron');
  await fs.rename(binary, binary.replace(/electron$/i, `${pkgConfig.name}`));
}

async function createTarball(blinkDeploymentTemporaryDirectory, blinkDeploymentOutputDirectory) {
  const dirname = path.dirname(blinkDeploymentTemporaryDirectory)
  const basename = path.basename(blinkDeploymentTemporaryDirectory);
  const artifact = path.join(blinkDeploymentOutputDirectory, path.basename(blinkDeploymentTemporaryDirectory).replace(/^nw/i, pkgConfig.name) + '.tar.gz');
  try {
    await fs.unlink(artifact);
  } catch (error) {/**/ }
  const command = `tar -czvf ${artifact} -C ${dirname} ./${basename}`;
  await run(command);
}