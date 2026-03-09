import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'thunderscans',
        title: 'ThunderScans'
    },
    container: {
        url: 'https://en-thunderscans.com/comics/asura/',
        id: '/comics/asura/',
        title: 'Asura'
    },
    child: {
        id: '/asura-chapter-11/',
        title: 'Chatper 11'
    },
    entry: {
        index: 0,
        size: 910_210,
        type: 'image/webp'
    }
}).AssertWebsite();