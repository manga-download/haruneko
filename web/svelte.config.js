import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
export default {
    compilerOptions: {
        // TODO: Enable after lifecycle management has been fully migrated to use Svelte 5 Runes for reactivity
        runes: false,
    },
    preprocess: vitePreprocess(),
};