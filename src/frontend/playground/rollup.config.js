import { terser as minify } from "rollup-plugin-terser";
import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';

const isDevelopment = process.env.ROLLUP_WATCH === 'true';
const isProduction = !isDevelopment;

export default {
    input: {
        'frontend/Playground': 'src/frontend/playground/Frontend.ts'
    },
    output: [
        {
            dir: 'build.web',
            format: 'esm',
            sourcemap: true
        }
    ],
    plugins: [
        vue({
            css: true
        }),
        typescript({
            typescript: require('typescript')
        }),
        isProduction && minify({
            include: [],
            exclude: []
        })
    ]
};