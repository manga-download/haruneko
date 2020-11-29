import base from './jest';

const frontend = Object.assign(base, {
    rootDir: '../src/frontend',
    displayName: 'Frontend Tests',
    reporters: [ 'default' ]
});

export default frontend;