import path from 'node:path';
import fs from 'node:fs/promises';
import { purge, run } from '../../tools.mjs';

const dirBuild = path.resolve('build');
const pkgFile = 'package.json';
const pkgConfig = JSON.parse(await fs.readFile(pkgFile));
const targetFile = path.resolve(dirBuild, pkgFile);
let targetConfig = {};
try {
    targetConfig = JSON.parse(await fs.readFile(targetFile));
} catch { /* IGNORE */ }

await purge(dirBuild);

const manifest = {
    name: pkgConfig.name,
    //type: pkgConfig.type, // 'commonjs',
    main: pkgConfig.main,
    //'node-main': pkgConfig.main,
    url: pkgConfig.url,
    'node-remote': [
        'http://localhost/*',
        `${new URL(pkgConfig.url).origin}/*`
    ],
    'chromium-args': null,
    'user-agent': targetConfig['user-agent'] ?? null,
    dependencies: pkgConfig.dependencies
};

await fs.writeFile(targetFile, JSON.stringify(manifest, null, 4));
await run('npm install --only=production', dirBuild);