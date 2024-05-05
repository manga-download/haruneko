export default {
    preset: 'ts-jest',
    rootDir: '../web/src',
    testMatch: [ '**/engine/websites/*[_.]e2e.[jt]s' ],
    globalSetup: '../../test/PuppeteerSetup.ts',
    globalTeardown: '../../test/PuppeteerTeardown.ts',
    testEnvironment: '../../test/PuppeteerEnvironment.ts',
    reporters: [
        'default',
        '../../test/github-test-reporter'
    ],
    testTimeout: 25_000,
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: {
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                verbatimModuleSyntax: false,
            }
        }]
    }
};