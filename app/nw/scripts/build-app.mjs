import path from 'path';
import fs from 'fs-extra';
import { purge, run } from '../../tools.mjs';

const dirBuild = path.resolve('build');
const pkgFile = 'package.json';
const pkgConfig = await fs.readJSON(pkgFile);
const targetFile = path.resolve(dirBuild, pkgFile);
let targetConfig = {};
try {
    targetConfig = await fs.readJSON(targetFile);
} catch { /* IGNORE */ }

await purge(dirBuild);

const manifest = {
    name: pkgConfig.name,
    //type: 'commonjs',
    main: pkgConfig.main,
    //'node-main': pkgConfig.main,
    url: pkgConfig.url,
    'node-remote': [
        'http://localhost/*',
        `${new URL(pkgConfig.url).origin}/*`
    ],
    /*
    webkit: {
        plugin: true,
        'page-cache': false
    },
    */
    'user-agent': targetConfig['user-agent'] ?? null,
    dependencies: pkgConfig.dependencies
};

await fs.writeJSON(targetFile, manifest, { spaces: 4 });
await run('npm install --only=production', dirBuild);