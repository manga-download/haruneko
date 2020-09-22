const base = require('./jest.js');
module.exports = Object.assign(base, {
    rootDir: '../src/engine',
    displayName: 'Engine Tests',
    reporters: [ 'default' ]
});