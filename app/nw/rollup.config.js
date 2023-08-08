import typescript from '@rollup/plugin-typescript';
//import { nodeResolve } from '@rollup/plugin-node-resolve';
//import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/App.ts',
    output: {
        dir: 'build',
        format: 'cjs',
    },
    plugins: [
        typescript(),
        //nodeResolve(),
        //commonjs(),
    ]
};