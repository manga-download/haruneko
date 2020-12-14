const path = require('path');
const fs = require('fs-extra');
const config = require('./package.json');
const argv = require('yargs').argv;

const source = path.join(__dirname, 'src');
const target = path.join(__dirname, 'build.app');
const files = [ /*'main.js'*/ ];

async function getBranch() {
    return 'master';
}

async function getManifest() {
    let branch = await getBranch();
    const baseURL = argv.url || `${config.url}/${branch}`;
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
            position: 'center',
            //main mode
            width: 1280,
            height: 720,
            /*
            //splash mode
            "width": 310,
            "height": 400,
            "resizable": false,
            "frame": false,
            "transparent": true*/
        },
        dependencies: config.dependencies
    };
}

async function installModules() {

    let modules = path.join(__dirname, target, 'node_modules');

    try {
        await fs.remove(modules);
    } catch(error) {
        //
    }

    if(argv.modules) {
        // `cd $target` && `npm install --only=production`
    }
}

(async function main() {
    await fs.ensureDir(target);

    // copy files
    for(let file of files) {
        fs.copy(path.join(source, file), path.join(target, file));
    }

    // write application manifest
    let manifest = await getManifest();
    fs.writeJSON(path.join(target, 'package.json'), manifest, { spaces: 4 });

    // install node modules for deployment
    await installModules();
})();