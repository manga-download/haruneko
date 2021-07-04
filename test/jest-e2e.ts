import base from './jest';

const endtoend = Object.assign(base, {
    rootDir: './',
    testMatch: [ '**/*[_.](e2e).[jt]s(x)?' ],
    displayName: 'End-to-End Tests',
    testEnvironment: 'node',
    reporters: [ 'default' ]
});

export default endtoend;