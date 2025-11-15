import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicride',
        title: 'Comic Ride',
    },
    container: {
        url: 'https://comicride.jp/series/24a2c5eb2d433',
        id: '/series/24a2c5eb2d433',
        title: '呪われ侯爵様の訳ありメイド',
    },
    child: {
        id: '/episodes/c0ee21c1e9472/',
        title: '第1話',
    },
    entry: {
        index: 4,
        size: 1_818_485,
        type: 'image/png',
    }
}).AssertWebsite();