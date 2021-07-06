import preprocess from 'svelte-preprocess';
import { terser as minify } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import copy from 'rollup-plugin-copy';
import resolve from "@rollup/plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import typescript from '@rollup/plugin-typescript';
import livereload from "rollup-plugin-livereload";
import postcss from 'rollup-plugin-postcss';

const isProduction = process.env.ROLLUP_WATCH !== 'true';

export default {
    input: {
        'frontend/Classic': 'src/frontend/classic/Frontend.ts'
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
            //dev: !isProduction,
            preprocess: preprocess({ sourceMap: !isProduction })
            //css: css => css.write('css/classic.css')
        }),
        postcss({
            extract: 'css/classic.css'
        }),
        copy({
            targets: [
                { src: 'src/frontend/classic/theme', dest: 'build.web/css' },
                { src: 'node_modules/carbon-components-svelte/css/all.css', dest: 'build.web/css/theme' },
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