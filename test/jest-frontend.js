const base = require('./jest.js');
module.exports = Object.assign(base, {
    rootDir: '../src/frontend',
    displayName: 'Frontend Tests',
    reporters: [ 'default' ]
});