const base = {
    rootDir: '../src',
    testMatch: [ '**/*[_.](test|spec).[jt]s(x)?' ],
    displayName: 'All Tests',
    preset: 'ts-jest',
    testEnvironment: 'node',
    reporters: [
        'default',
        'jest-junit'
    ]
};

export default base;