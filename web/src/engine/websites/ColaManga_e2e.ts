import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'colamanga',
        title: 'Coco漫画'
    },
    container: {
        url: 'https://www.colamanga.com/manga-bm41941/',
        id: '/manga-bm41941/',
        title: `换位关系`
    },
    child: {
        id: '/manga-bm41941/1/10.html',
        title: '10.傻瓜'
    },
    entry: {
        index: 0,
        size: 39_019,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());