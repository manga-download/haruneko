import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toongrab',
        title: 'ToonGrab'
    },
    container: {
        url: 'https://toongrab.com/manga/god-of-martial-arts',
        id: '/manga/god-of-martial-arts',
        title: 'God of Martial Arts'
    },
    child: {
        id: '1261',
        title: 'Chapter 1261'
    },
    entry: {
        index: 1,
        size: 323_148,
        type: 'image/webp'
    }
}).AssertWebsite();