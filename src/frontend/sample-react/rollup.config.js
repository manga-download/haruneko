// React still does not provide ESM exports, so we need CommonJS transformer plugin ...
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser as minify } from "rollup-plugin-terser"
import typescript from 'rollup-plugin-typescript2'

const isProduction = process.env.ROLLUP_WATCH !== 'true';

export default {
    input: {
        'frontend/SampleReact': 'src/frontend/sample-react/Frontend.tsx'
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
            rollupCommonJSResolveHack: true
        }),
        resolve({
            browser: true,
            dedupe: module => /^react(-.*|$)/.test(module)
        }),
        commonjs({
            include: 'node_modules/**',
            sourceMap: false
        }),
        isProduction && minify()
    ]
};