import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicmedu',
        title: 'G-Comi'
    },
    container: {
        url: 'https://g-comi.jp/series/c2f3978c40eea/new',
        id: '/series/c2f3978c40eea',
        title: 'ぱらのいあけ〜じ'
    },
    child: {
        id: '/episodes/beaa305e9cf32',
        title: 'その(1)'
    },
    entry: {
        index: 0,
        size: 862_995,
        type: 'image/png'
    }
}).AssertWebsite();