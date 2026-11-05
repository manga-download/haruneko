import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangazizi',
        title: 'MangaZizi',
    },
    container: {
        url: 'https://mangazizi.com/manga/corporate-slave-ojisan-buys-tentacles/',
        id: JSON.stringify({ post: '14422', slug: '/manga/corporate-slave-ojisan-buys-tentacles/' }),
        title: 'Corporate Slave Ojisan Buys Tentacles',
    },
    child: {
        id: '/manga/corporate-slave-ojisan-buys-tentacles/part1-1/',
        title: 'Part1 1',
    },
    entry: {
        index: 1,
        size: 241_044,
        type: 'image/webp',
    },
}).AssertWebsite();