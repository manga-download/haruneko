import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        setupFiles: './vitest.setup.ts',
        include: [ '**/*[_.](test|spec).[jt]s(x)?' ],
        reporters: [ process.env.GITHUB_ACTIONS ? 'github-actions' : 'default' ],
    },
});