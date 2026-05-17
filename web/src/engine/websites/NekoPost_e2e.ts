import { TestFixture } from '../../../test/WebsitesFixture';

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