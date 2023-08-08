import path from 'path';
import fs from 'fs-extra';
import { purge, run } from './tools.mjs';

const pkgFile = 'package.json';
const pkgConfig = await fs.readJSON(pkgFile);
const dirBuild = path.resolve('build');

async function createApplicationManifest() {
    const manifest = {
        name: pkgConfig.name,
        //type: 'commonjs',
        main: pkgConfig.main,
        //'node-main': pkgConfig.main,
        url: pkgConfig.url,
        'node-remote': [
            'http://localhost/*',
            'https://haruneko.pages.dev/*'
        ],
        /*
        webkit: {
            plugin: true,
            'page-cache': false
        },
        */
        'user-agent': null,
        dependencies: pkgConfig.dependencies
    };
    const file = path.resolve(dirBuild, pkgFile);
    await fs.writeJSON(file, manifest, { spaces: 4 });
}

await purge(dirBuild);
await createApplicationManifest();
await run('npm install --only=production', dirBuild);