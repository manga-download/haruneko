export default {
    preset: 'ts-jest/presets/js-with-ts-esm',
    rootDir: '../src',
    testMatch: [ '**/*[_.](test|spec).[jt]s(x)?' ],
    testEnvironment: 'node',
    reporters: [
        'default',
        'jest-junit',
        '../../../test/github-test-reporter'
    ],
    globals: {
        'ts-jest': {
            tsconfig: {
                allowJs: true,
                esModuleInterop: true,
                //verbatimModuleSyntax: false,
            }
        }
    }
};