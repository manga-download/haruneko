import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'cosmicscansid',
        title: 'Cosmic Scans ID'
    },
    container: {
        url: 'https://kmvs03.com/manga/eleceed/',
        id: '/manga/eleceed/',
        title: 'Eleceed'
    },
    child: {
        id: '/eleceed-chapter-272/',
        title: 'Chapter 272'
    },
    entry: {
        index: 1,
        size: 98_349,
        type: 'image/jpeg'
    }
}).AssertWebsite();