import base from './jest';
const engine = Object.assign(base, {
    rootDir: '../src/engine',
    displayName: 'Engine Tests',
    reporters: [ 'default' ]
});

export default engine;