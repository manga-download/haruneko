import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangabang',
        title: 'MangaBANG Comics (マンガBANG コミックス)'
    },
    container: {
        url: 'https://comics.manga-bang.com/series/c2153a77b6019',
        id: '/series/c2153a77b6019',
        title: '藤崎くんちのお母さんには秘密がある'
    },
    child: {
        id: '/episodes/fff51cc22815e/',
        title: '藤崎くんちのお母さん (1)'
    },
    entry: {
        index: 0,
        size: 940_071,
        type: 'image/png'
    }
}).AssertWebsite();