import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangakita',
        title: 'MangaKita'
    },
    container: {
        url: 'https://mangakita.id/manga/closer/',
        id: '/manga/closer/',
        title: '[C]LOSER'
    },
    child: {
        id: '/closer-chapter-30-bahasa-indonesia/',
        title: 'Chapter 30',
        timeout: 10000
    },
    entry: {
        index: 0,
        size: 93_552,
        type: 'image/jpeg'
    }
}).AssertWebsite();