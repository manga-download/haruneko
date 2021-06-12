import path from 'path';
import fs from 'fs-extra';
import yargs from 'yargs';
import { purge, run } from './tools.mjs';

const argv = yargs(process.argv).argv;
const pkgFile = 'package.json';
const pkgConfig = await fs.readJSON(pkgFile);
const dirBuild = path.join('.', 'build.app');

async function createApplicationManifest() {
    const manifest = {
        name: pkgConfig.title,
        description: pkgConfig.description,
        'chromium-args': '--ignore-certificate-errors',
        main: argv.url + '/index.html',
        'node-remote': [
            argv.url + '/*'
        ],
        /*
        webkit: {
            plugin: true,
            'page-cache': false
        },
        */
        window: {
            show: false,
            frame: false,
            transparent: true,
            width: 1280,
            height: 720,
            position: 'center',
            title: `${pkgConfig.title} - ${pkgConfig.description}`
        },
        dependencies: pkgConfig.dependencies
    };
    const file = path.join(dirBuild, pkgFile);
    await fs.writeJSON(file, manifest, { spaces: 4 });
}

await purge(dirBuild);
await createApplicationManifest();
await run('npm install --only=production', dirBuild);