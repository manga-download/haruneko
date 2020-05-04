const path = require('path');
const fs = require('fs-extra');
const config = require('./package.json');

const meta = {
    name: config.name,
    main: config.main,
    //version: config.devDependencies.nw.split('-')[0],
    'node-remote': [
        '*://localhost/*',
        'https://manga-download.github.io/hakuneko/*'
    ]
    //dependencies: config.dependencies
}
const source = 'src';
const target = 'build.app';
const files = [
    'main.js'
];

async function generateIndexFrontends() {
    //
}

async function generateIndexPlugins() {
    //
}

(async function main() {
    await fs.ensureDir(target);
    for(let file of files) {
        fs.copy(path.join(source, file), path.join(target, file));
    }
    fs.writeJSON(path.join(target, 'package.json'), meta, { spaces: 4 });
    // install node modules for deployment
    // `cd $target` && `npm install --only=production`
})();