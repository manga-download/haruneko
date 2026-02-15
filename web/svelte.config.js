import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
export default {
    compilerOptions: {
        runes: true,
    },
    preprocess: vitePreprocess(),
};