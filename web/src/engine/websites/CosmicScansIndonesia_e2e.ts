import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'cosmicscansid',
        title: 'Cosmic Scans Indonesia'
    },
    container: {
        url: 'https://02.cosmicscans.to/series/eleceed/',
        id: 'eleceed',
        title: 'Eleceed'
    },
    child: {
        id: 'eleceed-chapter-272',
        title: 'Chapter 272'
    },
    entry: {
        index: 1,
        size: 98_349,
        type: 'image/jpeg'
    }
}).AssertWebsite();