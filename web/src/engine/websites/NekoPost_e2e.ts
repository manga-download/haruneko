import { TestFixture } from '../../../test/WebsitesFixture';

// CASE : old CDN
new TestFixture({
    plugin: {
        id: 'nekopost',
        title: 'NekoPost',
    },
    container: {
        url: 'https://www.nekopost.net/manga/8175',
        id: '/manga/8175',
        title: '[จบ] Isekai Ouji no Toshiue Cinderella'
    },
    child: {
        id: '/manga/8175/7',
        title: 'Ch.7 - Chapter 7 【END】'
    },
    entry: {
        index: 0,
        size: 239_894,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE : new CDN
new TestFixture({
    plugin: {
        id: 'nekopost',
        title: 'NekoPost',
    },
    container: {
        url: 'https://www.nekopost.net/manga/17834',
        id: '/manga/17834',
        title: 'ลากมา เ ก ที่บ้านซะเลย'
    },
    child: {
        id: '/manga/17834/0',
        title: 'Ch.0 - One-Shot'
    },
    entry: {
        index: 0,
        size: 487_282,
        type: 'image/jpeg'
    }
}).AssertWebsite();