import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ vue(), react(), svelte() ],
    publicDir: 'static',
    build: {
        sourcemap: true,
        outDir: 'build',
        rollupOptions: {
            output: {
                chunkFileNames: 'assets/[hash].js'
            }
        }
    },
    optimizeDeps: {
        // TODO: once carbon-componenets-svelte v1 is released, check if svelte optimize has been improved
        exclude: [
            'carbon-components-svelte',
            'carbon-icons-svelte'
        ]
    }
});