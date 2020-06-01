import { terser as minify } from "rollup-plugin-terser";
import typescript from 'rollup-plugin-typescript2';

const isProduction = process.env.ROLLUP_WATCH !== 'true';

export default {
    input: {
        'frontend/Classic': 'src/frontend/classic/Frontend.ts'
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
        isProduction && minify()
    ]
};