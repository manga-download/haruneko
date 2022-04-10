import path from 'path';
import fs from 'fs-extra';
import yargs from 'yargs';
import { purge, run } from './tools.mjs';

const argv = yargs(process.argv).argv;
const pkgFile = 'package.json';
const pkgConfig = await fs.readJSON(pkgFile);
const dirBuild = path.resolve('build.app');
const origin = (argv.url || pkgConfig.main);

async function createApplicationManifest() {
    const manifest = {
        name: pkgConfig.title,
        description: pkgConfig.description,
        main: origin + '/index.html',
        'node-remote': [
            origin + '/*'
        ],
        /*
        webkit: {
            plugin: true,
            'page-cache': false
        },
        */
        window: {
            id: pkgConfig.name,
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
    const file = path.resolve(dirBuild, pkgFile);
    await fs.writeJSON(file, manifest, { spaces: 4 });
}

await purge(dirBuild);
await createApplicationManifest();
await run('npm install --only=production', dirBuild);