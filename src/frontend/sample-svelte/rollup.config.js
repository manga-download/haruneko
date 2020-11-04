import preprocess from 'svelte-preprocess';
import { terser as minify } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import copy from 'rollup-plugin-copy';
import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import typescript from '@rollup/plugin-typescript';
import livereload from "rollup-plugin-livereload";

const isProduction = process.env.ROLLUP_WATCH !== 'true';

export default {
    input: {
        'frontend/SampleSvelte': 'src/frontend/sample-svelte/Frontend.ts'
    },
    output: [
        {
            dir: 'build.web',
            format: 'es',
            sourcemap: true
        }
    ],
    plugins: [
        svelte({
            dev: !isProduction,
            preprocess: preprocess(),
            css: css => css.write('css/sample-svelte.css')
        }),
        copy({
            targets: [
                { src: 'src/frontend/sample-svelte/theme', dest: 'build.web/css' }
            ]
        }),
        resolve({
            browser: true,
            dedupe: ["svelte"]
        }),
        commonjs(),
        typescript(),
        !isProduction && livereload("build.web"),
        isProduction && minify()
    ]
};