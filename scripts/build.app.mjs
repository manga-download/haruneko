import path from 'path';
import fs from 'fs-extra';
import yargs from 'yargs';
const argv = yargs(process.argv).argv;
const pkg = 'package.json';
const target = path.join('.', 'build.app', pkg);

async function getManifest(config) {
    const baseURL = argv.url;
    return {
        name: config.title,
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

const nwVersion = config.devDependencies.nw.split('-').shift();
const nwBuildType = config.devDependencies.nw.match(/(-sdk)?$/)[0];
const nwPlatform = process.platform.replace('win32', 'win').replace('darwin', 'osx');
const nwArchitecture = process.arch;
const nwExtension = nwPlatform === 'linux' ? 'tar.gz' : 'zip';

const url = `https://dl.nwjs.io/v${nwVersion}/nwjs${nwBuildType}-v${nwVersion}-${nwPlatform}-${nwArchitecture}.${nwExtension}`;

console.log(url);