import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangalc',
        title: 'MangaLC'
    },
    container: {
        url: 'https://manga-lc.net/manga/reincarnator/',
        id: JSON.stringify({ post: '153165', slug: '/manga/reincarnator/' }),
        title: 'Reincarnator'
    },
    child: {
        id: encodeURI('/manga/reincarnator/ซี่ซั่น-1/ตอนที่-91/').toLowerCase(),
        title: 'ตอนที่ 91'
    },
    entry: {
        index: 0,
        size: 656_244,
        type: 'image/webp'
    }
}).AssertWebsite();