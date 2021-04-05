import base from './jest';

const engine = Object.assign(base, {
    rootDir: './',
    displayName: 'End-to-End Tests',
    reporters: [ 'default' ]
});

export default engine;