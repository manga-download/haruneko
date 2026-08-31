import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manganeko',
        title: 'Manga-Neko'
    },
    container: {
        url: 'https://manga-neko.com/the-return-of-the-unrivaled-genius-ranker/',
        id: '/the-return-of-the-unrivaled-genius-ranker/',
        title: 'The Return of the Unrivaled Genius Ranker การกลับมาของแรงเกอร์อัจฉริยะในตำนาน'
    },
    child: {
        id: encodeURI('/the-return-of-the-unrivaled-genius-ranker-ตอนที่-30/').toLowerCase(),
        title: 'ตอนที่ 30'
    },
    entry: {
        index: 5,
        size: 48_618,
        type: 'image/webp'
    }
}).AssertWebsite();