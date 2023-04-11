import { Request } from 'node-fetch';

export default {
    preset: 'ts-jest/presets/js-with-ts-esm',
    rootDir: '../src',
    testMatch: [ '**/*[_.](test|spec).[jt]s(x)?' ],
    testEnvironment: 'jest-environment-jsdom',
    reporters: [
        'default',
        'jest-junit',
        '../../test/github-test-reporter'
    ],
    moduleNameMapper: {
        '\\.(png|jpg|webp|ico|gif)$': '<rootDir>/img/mock.ts'
    },
    transform: {
        '\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: {
                    allowJs: true,
                    esModuleInterop: true,
                    verbatimModuleSyntax: false,
                }
            }
        ]
    },
    globals: {
        'Request': Request
    }
};