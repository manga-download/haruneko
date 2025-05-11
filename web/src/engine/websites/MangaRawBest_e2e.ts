import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangarawbest',
        title: 'MangaRaw(.best)'
    },
    container: {
        url: 'https://mangaraw.best/raw/long-ren-nolin-ren',
        id: '/raw/long-ren-nolin-ren',
        title: '竜人の隣人'
    },
    child: {
        id: '/raw/long-ren-nolin-ren/di-5hua',
        title: '第5話'
    },
    entry: {
        index: 0,
        size: 319_719,
        type: 'image/jpeg'
    }
}).AssertWebsite();