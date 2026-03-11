import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaruhu',
        title: 'MangaRuhu'
    },
    container: {
        url: 'https://mangaruhu.com/manga/boslugun-hukumdari/',
        id: '/manga/boslugun-hukumdari/',
        title: 'Boşluğun Hükümdarı'
    },
    child: {
        id: '/manga/boslugun-hukumdari/bolum-1/',
        title: 'Bölüm 1',
    },
    entry: {
        index: 0,
        size: 715_642,
        type: 'image/jpeg'
    }
}).AssertWebsite();