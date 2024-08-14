import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: [ '**/*[_.](test|spec).[jt]s(x)?' ],
        reporters: process.env.GITHUB_ACTIONS ? [ 'basic', 'github-actions' ] : [ 'default' ],
    },
});