import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'itsyourightmanhua',
        title: 'Its Your Right Manhua'
    },
    container: {
        url: 'https://itsyourightmanhua.com/manga/shen-yin-wang-zuo/',
        id: JSON.stringify({ post: '167', slug: '/manga/shen-yin-wang-zuo/' }),
        title: 'Shen Yin Wang Zuo'
    },
    child: {
        id: '/manga/shen-yin-wang-zuo/227/',
        title: '227  - (RAW -511)'
    },
    entry: {
        index: 1,
        size: 370_276,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());