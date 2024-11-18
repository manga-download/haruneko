import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'cosmicscansid',
        title: 'Cosmic Scans ID'
    },
    container: {
        url: 'https://cosmic345.co/manga/eleceed/',
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
};

new TestFixture(config).AssertWebsite();