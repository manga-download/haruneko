const path = require('path');
const fs = require('fs-extra');
const config = require('./package.json');
const argv = require('yargs').argv;

const target = path.join(__dirname, 'build.app', 'package.json');

async function getManifest() {
    const baseURL = argv.url;
    return {
        name: config.name,
        description: config.description,
        'chromium-args': '--ignore-certificate-errors',
        //main mode
        main: baseURL + '/index.html',
        //splash mode
        //main: baseURL + '/splash.html',
        //main: config.main,
        //url: baseURL + '/index.html',
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
            title: `${config.title} - ${config.description}`,
            //icon: 'link.png',
            //toolbar: true,
            //frame: false,
            //transparent: false,
            position: 'center',
            width: 1280,
            height: 720,
            show: false,
        },
        dependencies: config.dependencies
    };
}

(async function main() {
    let manifest = await getManifest();
    fs.writeJSON(target, manifest, { spaces: 4 });
})();