import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangalc',
        title: 'MangaLC'
    },
    container: {
        url: 'https://manga-lc.net/manga/reincarnator/',
        id: JSON.stringify({ post: '153165', slug: '/manga/reincarnator/' }),
        title: 'Reincarnator - การแข่งขันของผู้เกิดใหม่'
    },
    child: {
        id: encodeURI('/manga/reincarnator-การแข่งขันของผู้เกิด/ซี่ซั่น-1/ตอนที่-91/').toLowerCase(),
        title: 'ตอนที่ 91'
    },
    entry: {
        index: 1,
        size: 33_366,
        type: 'image/webp'
    }
}).AssertWebsite();