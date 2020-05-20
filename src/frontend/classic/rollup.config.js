import { terser as minify } from "rollup-plugin-terser";
import typescript from 'rollup-plugin-typescript2';

const isDevelopment = process.env.ROLLUP_WATCH === 'true';
const isProduction = !isDevelopment;

export default {
    input: {
        'frontend/Classic': 'src/frontend/classic/Frontend.tsx'
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
        isProduction && minify({
            include: [],
            exclude: []
        })
    ]
};