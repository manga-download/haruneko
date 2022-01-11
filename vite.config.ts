import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ vue(), react(), svelte() ],
    publicDir: 'static',
    build: {
        outDir: 'build.web',
        chunkSizeWarningLimit: 1024
    }
});