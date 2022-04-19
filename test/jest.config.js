import { Request } from 'node-fetch';

export default {
    preset: 'ts-jest',
    rootDir: '../src',
    testMatch: [ '**/*[_.](test|spec).[jt]s(x)?' ],
    testEnvironment: 'jest-environment-jsdom',
    reporters: [ 'default', 'jest-junit' ],
    moduleNameMapper: {
        '\\.(png|jpg|webp|ico|gif)$': '<rootDir>/img/mock.ts'
    },
    globals: {
        'ts-jest': {
            tsconfig: {
                esModuleInterop: true
            }
        },
        'Request': Request
    }
};