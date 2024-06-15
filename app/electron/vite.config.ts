import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        ssr: true,
        emptyOutDir: false,
        outDir: resolve(__dirname, 'build'),
        lib: {
            entry: [
                resolve(__dirname, 'src', 'Main.ts'),
                resolve(__dirname, 'src', 'ipc', 'Preload.ts'),
                resolve(__dirname, 'src', 'ipc', 'RemoteBrowserWindowPreload.ts'),
            ],
            formats: [ 'cjs' ]
        },
        rollupOptions: {
            output: {
                entryFileNames: ({ name }) => `${name}.js`.toLowerCase(),
                chunkFileNames: ({ name }) => `${name}.js`.toLowerCase(),
            }
        }
    },
});