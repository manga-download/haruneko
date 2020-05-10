const path = require('path');
const fs = require('fs-extra');
const config = require('./package.json');
const argv = require('yargs').argv;

    // TODO: apply current branch ...
const baseURL = argv.url || `https://manga-download.github.io/hakuneko-nw/${'master'}`;
const meta = {
    name: config.name,
    title: `${config.title} - ${config.description}`,
    main: config.main,
    url: baseURL + '/index.html',
    'node-remote': [
        baseURL + '/*'
    ],
    dependencies: config.dependencies
};
const source = 'src';
const target = 'build.app';
const files = [
    'main.js'
];

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