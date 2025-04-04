import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const buildID = Date.now().toString(36).toUpperCase();

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        react(),
        svelte({
            onwarn: function(warning, handler) {
                return warning.code.startsWith('a11y-') ? undefined : handler?.call(this, warning);
            }
        }),
    ],
    publicDir: 'static',
    build: {
        minify: 'esbuild',
        sourcemap: false,
        outDir: 'build',
        chunkSizeWarningLimit: 2 * 1024,
        rollupOptions: {
            input: {
                index: './index.html',
                sw: './src/service-worker.ts',
            },
            output: {
                entryFileNames: file => (file.name !== 'sw' ? `${buildID}/` : '') + '[name].js',
                assetFileNames: `${buildID}/[name].[ext]`,
                chunkFileNames: `${buildID}/[name].js`,
                manualChunks: function(id) {
                    if(id.includes('node_modules')) {
                        return 'Vendor';
                    }
                    if(/\/web\/src\/engine\/websites\//.test(id) && /\/[a-zA-Z0-9_-]+\.webp$/.test(id)) {
                        return 'WebsiteIcons';
                    }
                },
            },
        },
    },
    worker: {
        rollupOptions: {
            output: {
                entryFileNames: `${buildID}/[name].js`,
                assetFileNames: `${buildID}/[name].[ext]`,
                chunkFileNames: `${buildID}/[name].js`,
            }
        }
    },
    esbuild: {
        minifySyntax: true,
        minifyWhitespace: true,
        minifyIdentifiers: false,
        keepNames: true,
    },
    optimizeDeps: {
        // TODO: once carbon-componenets-svelte v1 is released, check if svelte optimize has been improved
        // carbon-components-svelte is large, prebundle
        include: ['carbon-components-svelte'],
    },
    server: {
        headers: {
            'Service-Worker-Allowed': '/'
        }
    }
});