import preprocess from 'svelte-preprocess';
import { terser as minify } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
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
        }),
        postcss(),
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