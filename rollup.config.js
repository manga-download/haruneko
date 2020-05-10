import config from './package.json';
import copy from 'rollup-plugin-copy';
import { terser } from "rollup-plugin-terser";
import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';
//import reload from 'rollup-plugin-livereload';

const inputDirectory = 'src';
const outputDirectory = 'build.www';

const watch = process.env.ROLLUP_WATCH === 'true';

function launch(options) {
    return {
        name: 'plugin-name',
        load() { /* ... */ },
        resolveId() { /* ... */ },
        generateBundle() { /* ... */ },
    }
};

const configApp = {
    input: {
        'App': inputDirectory + '/App.ts',
        'frontend/Classic': inputDirectory + '/frontend/classic/Frontend.tsx',
        'frontend/Playground': inputDirectory + '/frontend/playground/Frontend.tsx'
    },
    output: [
        {
            dir: 'build.www',
            format: 'esm',
            sourcemap: true
        }
    ],
    external: [
        ...Object.keys(config.dependencies || {})
    ],
    plugins: [
        copy({
            targets: [
                { src: inputDirectory + '/*.html', dest: outputDirectory },
                { src: inputDirectory + '/img/**/*', dest: outputDirectory + '/img' }
            ]
        }),
        typescript({
            typescript: require('typescript'),
        }),
        //terser() // minifies generated bundles
        watch && serve({
            contentBase: outputDirectory,
            port: 5000
        }),/*
        reload({
            watch: outputDirectory
        }),*/
        //watch && launch({})
    ]
};

export default [
    configApp//,
    //configClassic
];