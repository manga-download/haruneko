// React still does not provide ESM exports, so we need CommonJS transformer plugin ...
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser as minify } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';

const isProduction = process.env.ROLLUP_WATCH !== 'true';

export default {
    input: {
        'frontend/SampleReact': 'src/frontend/sample-react/Frontend.tsx'
    },
    output: [
        {
            dir: 'build.web',
            format: 'es',
            sourcemap: true
        }
    ],
    plugins: [
        resolve({
            browser: true,
            dedupe: module => /^react(-.*|$)/.test(module)
        }),
        commonjs({
            include: 'node_modules/**',
            sourceMap: false
        }),
        typescript(),
        isProduction && minify()
    ]
};