const base = {
    preset: 'ts-jest',
    rootDir: '../src',
    testMatch: [ '**/*[_.](test|spec).[jt]s(x)?' ],
    displayName: 'All Tests',
    testEnvironment: 'jest-environment-jsdom',
    reporters: [
        'default',
        'jest-junit'
    ]
};

export default base;