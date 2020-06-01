import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import { terser as minify } from "rollup-plugin-terser"
import typescript from 'rollup-plugin-typescript2'

const isProduction = process.env.ROLLUP_WATCH !== 'true';

export default {
    input: {
        'frontend/SampleSvelte': 'src/frontend/sample-svelte/Frontend.ts'
    },
    output: [
        {
            dir: 'build.web',
            format: 'esm',
            sourcemap: true
        }
    ],
    plugins: [
        typescript({
            typescript: require('typescript'),
        }),
		svelte({
			dev: !isProduction,
			//css: css => css.write('build.web/css/sample-svelte.css')
		}),
        resolve({
          browser: true,
          dedupe: module => /^svelte(\/|$)/.test(module)
        }),
        isProduction && minify({
            include: [],
            exclude: []
        })
    ]
};