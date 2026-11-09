import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tapas',
        title: 'Tapas'
    },
    container: {
        url: 'https://tapas.io/series/279061',
        id: '279061',
        title: `When You're in Love`
    },
    child: {
        id: '/episode/3117541',
        title: 'Episode 1'
    },
    entry: {
        index: 1,
        size: 57_370,
        type: 'image/jpeg'
    }
}).AssertWebsite();

new TestFixture({
    plugin: {
        id: 'tapas',
        title: 'Tapas'
    },
    container: {
        url: 'https://tapas.io/series/lets-get-explicit-mature',
        id: '315644',
        title: `Let's Get Explicit (Mature)`
    },
    child: {
        id: '/episode/3671230',
        title: '1. Hard at Work'
    },
    entry: {
        index: 1,
        size: 445_083,
        type: 'image/jpeg'
    }
}).AssertWebsite();