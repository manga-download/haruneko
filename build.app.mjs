import path from 'path';
import fs from 'fs-extra';
import yargs from 'yargs';
const argv = yargs(process.argv).argv;
const pkg = 'package.json';
const target = path.join('.', 'build.app', pkg);

async function getManifest(config) {
    const baseURL = argv.url;
    return {
        name: 'HakuNeko', // config.name,
        description: config.description,
        'chromium-args': '--ignore-certificate-errors',
        main: baseURL + '/index.html',
        'node-remote': [
            baseURL + '/*'
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
            title: `${config.title} - ${config.description}`
        },
        dependencies: config.dependencies
    };
}

const config = await fs.readJSON(pkg);
const manifest = await getManifest(config);
fs.writeJSON(target, manifest, { spaces: 4 });