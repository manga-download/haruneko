import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Specific chapter from source Kagane
new TestFixture({
    plugin: {
        id: 'yaoime',
        title: 'Yaoi.me',
    },
    container: {
        url: 'https://yaoi.me/series/52254/black-blood',
        id: '/series/52254/black-blood',
        title: 'Black Blood'
    },
    child: {
        id: '/chapter/127673/4754160',
        title: 'Act. 5 (en) [Kagane @ 18 pages]'
    },
    entry: {
        index: 0,
        size: 686_561,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Specific chapter from source MangaBall (but with 18 pages)
new TestFixture({
    plugin: {
        id: 'yaoime',
        title: 'Yaoi.me',
    },
    container: {
        url: 'https://yaoi.me/series/52254/black-blood',
        id: '/series/52254/black-blood',
        title: 'Black Blood'
    },
    child: {
        id: '/chapter/3692/3164096',
        title: 'Act. 5 (en) [MangaBall @ 18 pages]'
    },
    entry: {
        index: 0,
        size: 686_561,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: Specific chapter from source MangaBall (but with 36 pages)
new TestFixture({
    plugin: {
        id: 'yaoime',
        title: 'Yaoi.me',
    },
    container: {
        url: 'https://yaoi.me/series/52254/black-blood',
        id: '/series/52254/black-blood',
        title: 'Black Blood'
    },
    child: {
        id: '/chapter/3692/3164095',
        title: 'Act. 5 (en) [MangaBall @ 36 pages]'
    },
    entry: {
        index: 0,
        size: 686_561,
        type: 'image/jpeg'
    }
}).AssertWebsite();