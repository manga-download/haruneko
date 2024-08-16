import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: [ '**/website-metrics.ts' ],
        reporters: process.env.GITHUB_ACTIONS ? [ 'basic' ] : [ 'dot' ],
    },
});