import config from './package.json';
import copy from 'rollup-plugin-copy';
import { terser as minify } from "rollup-plugin-terser";
import typescript from 'rollup-plugin-typescript2';
import serve from 'rollup-plugin-serve';
//import reload from 'rollup-plugin-livereload';
import vue from 'rollup-plugin-vue';

import FrontendClassic from './src/frontend/classic/rollup.config';
import FrontendPlayground from './src/frontend/playground/rollup.config';

const outputDirectory = 'build.web';

const isDevelopment = process.env.ROLLUP_WATCH === 'true';
const isProduction = !isDevelopment;

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
        'App': 'src/App.ts',
        //'frontend/Classic': inputDirectory + '/frontend/classic/Frontend.tsx',
        //'frontend/Playground': inputDirectory + '/frontend/playground/Frontend.ts'
    },
    output: [
        {
            dir: outputDirectory,
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
                { src: 'src/*.html', dest: outputDirectory },
                { src: 'src/img/**/*', dest: outputDirectory + '/img' }
            ]
        }),
        vue(),
        typescript({
            typescript: require('typescript'),
        }),
        isProduction && minify({
            include: [],
            exclude: []
        }),
        isDevelopment && serve({
            contentBase: outputDirectory,
            port: 5000
        })/*,
        reload({
            watch: outputDirectory
        }),*/
        //isDevelopment && launch({})
    ]
};

export default [
    configApp,
    FrontendClassic,
    FrontendPlayground
];