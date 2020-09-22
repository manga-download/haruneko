module.exports = {
    rootDir: '../src',
    testMatch: [ '**/*[_.](spec|test).[jt]s(x)?' ],
    displayName: 'All Tests',
    preset: 'ts-jest',
    testEnvironment: 'node',
    reporters: [
        'default',
        'jest-junit'
    ]
};