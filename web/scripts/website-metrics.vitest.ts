import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        setupFiles: 'web/vitest.setup.ts',
        include: [ 'web/scripts/website-metrics.ts' ],
        reporters: [ process.env.GITHUB_ACTIONS ? 'github-actions' : 'dot' ],
    },
});