import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaraw18',
        title: 'MangaRaw18',
    },
    container: {
        url: 'https://mangaraw18.net/manga/kai-shuan-ri-zhi',
        id: '/manga/kai-shuan-ri-zhi',
        title: '開栓日誌',
    },
    child: {
        id: '/manga/kai-shuan-ri-zhi/di68hua',
        title: '第68話',
    },
    entry: {
        index: 0,
        size: 97_624,
        type: 'image/webp',
    }
}).AssertWebsite();