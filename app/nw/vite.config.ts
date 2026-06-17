import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        ssr: true,
        emptyOutDir: false,
        outDir: resolve(__dirname, 'build'),
        lib: {
            entry: resolve(__dirname, 'src', 'App.ts'),
            formats: [ 'cjs' ]
        },
        rolldownOptions: {
            output: {
                entryFileNames: ({ name }) => `${name}.js`.toLowerCase(),
                chunkFileNames: ({ name }) => `${name}.js`.toLowerCase(),
            }
        }
    },
});