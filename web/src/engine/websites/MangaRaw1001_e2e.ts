import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaraw1001',
        title: 'MangaRaw1001'
    },
    container: {
        url: 'https://mangaraw1001.cc/manga/xueto-huino-nu-wang',
        id: '/manga/xueto-huino-nu-wang',
        title: '血と灰の女王'
    },
    child: {
        id: '222515',
        title: '第200話'
    },
    entry: {
        index: 0,
        size: 185_526,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();