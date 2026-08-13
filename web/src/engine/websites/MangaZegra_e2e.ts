import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangazegra',
        title: 'Manga Zegra'
    },
    container: {
        url: 'https://manga-zegra.com/series/c8f3cf8365750',
        id: '/series/c8f3cf8365750',
        title: '勇者パーティーをクビになった忍者、忍ばずに生きます'
    },
    child: {
        id: '/episodes/20a2ce2983ba8',
        title: '1',
        timeout: 10_000
    },
    entry: {
        index: 17,
        size: 887_657,
        type: 'image/png'
    }
}).AssertWebsite();