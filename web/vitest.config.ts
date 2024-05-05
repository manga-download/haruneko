/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        include: [ '**/*[_.](test|spec).[jt]s(x)?' ],
        reporters: process.env.GITHUB_ACTIONS ? ['basic', 'github-actions'] : [ 'default' ],
    },
});