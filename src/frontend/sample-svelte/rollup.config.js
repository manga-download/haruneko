import svelte from 'rollup-plugin-svelte';
import preprocess from 'svelte-preprocess';
import resolve from '@rollup/plugin-node-resolve';
import { terser as minify } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';

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
            preprocess: preprocess()
            //css: css => css.write('build.web/css/sample-svelte.css')
        }),
        resolve({
            browser: true,
            dedupe: module => /^svelte(\/|$)/.test(module)
        }),
        typescript(),
        isProduction && minify()
    ]
};