import { terser as minify } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';

const isProduction = process.env.ROLLUP_WATCH !== 'true';

export default {
    input: {
        'frontend/SampleJS': 'src/frontend/sample-js/Frontend.ts'
    },
    output: [
        {
            dir: 'build.web',
            format: 'es',
            sourcemap: true
        }
    ],
    plugins: [
        typescript(),
        isProduction && minify()
    ]
};