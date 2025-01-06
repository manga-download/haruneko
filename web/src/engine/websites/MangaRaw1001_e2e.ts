import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaraw1001',
        title: 'MangaRaw1001',
    },
    container: {
        url: 'https://mangaraw1001.cc/manga/xueto-huino-nu-wang',
        id: '/manga/xueto-huino-nu-wang',
        title: '血と灰の女王',
    },
    child: {
        id: '/manga/xueto-huino-nu-wang/di200hua',
        title: '第200話',
    },
    entry: {
        index: 0,
        size: 185_526,
        type: 'image/webp',
    }
}).AssertWebsite();