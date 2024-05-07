/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        testTimeout: 25_000,
        fileParallelism: false,
        globalSetup: './test/PuppeteerGlobal.ts',
        dir: './web/src/engine/websites',
        include: [ '**/*[_.]e2e.[jt]s' ],
        reporters: process.env.GITHUB_ACTIONS ? ['basic', 'github-actions'] : [ 'default', 'hanging-process' ],
    },
});