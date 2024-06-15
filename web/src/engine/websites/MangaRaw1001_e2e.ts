import { describe } from 'vitest';
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
        id: '/manga/xueto-huino-nu-wang/di148hua',
        title: '# 第148話'
    },
    entry: {
        index: 0,
        size: 691_935,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());