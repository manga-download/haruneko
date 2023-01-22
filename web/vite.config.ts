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
        exclude: [
            'carbon-components-svelte ',
            'carbon-icons-svelte'
        ]
    }
});