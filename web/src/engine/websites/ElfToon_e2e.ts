import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'elftoon',
        title: 'Elf Toon',
    },
    container: {
        url: 'https://elftoon.com/manga/number-one-beast-master/',
        id: '/manga/number-one-beast-master/',
        title: 'Number One Beast Master'
    },
    child: {
        id: '/number-one-beast-master-chapter-61/',
        title: 'Chapter 61'
    },
    entry: {
        index: 0,
        size: 2_274_646,
        type: 'image/webp'
    }
}).AssertWebsite();