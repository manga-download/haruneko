import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tumangaonlinehentai',
        title: 'TMOHentai'
    },
    container: {
        url: 'https://tmohentai.com/contents/642cba8a84de5',
        id: '/contents/642cba8a84de5',
        title: 'INSTINCT WORLD'
    },
    child: {
        id: '/reader/642cba8a84de5/cascade',
        title: 'INSTINCT WORLD'
    },
    entry: {
        index: 0,
        size: 306_888,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());