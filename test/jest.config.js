export default {
    preset: 'ts-jest',
    rootDir: '../src',
    testMatch: [ '**/*[_.](test|spec).[jt]s(x)?' ],
    testEnvironment: 'jest-environment-jsdom',
    reporters: [ 'default', 'jest-junit' ]
};