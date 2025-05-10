import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kaliscan',
        title: 'KaliScan'
    },
    container: {
        url: 'https://kaliscan.io/manga/43342-i-can-have-infinite-epiphanies',
        id: '/manga/43342-i-can-have-infinite-epiphanies',
        title: 'I Can Have Infinite Epiphanies'
    },
    child: {
        id: '/manga/43342-i-can-have-infinite-epiphanies/chapter-115',
        title: 'Chapter 115',
    },
    entry: {
        index: 0,
        size: 423_424,
        type: 'image/webp'
    }
}).AssertWebsite();