import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'gooffansub',
        title: 'Goof Fansub'
    },
    container: {
        url: 'https://gooffansub.com/manga/bingqiu-au/',
        id: JSON.stringify({ post: '3464', slug: '/manga/bingqiu-au/' }),
        title: 'BingQiu AU'
    },
    child: {
        id: '/manga/bingqiu-au/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 3_461_610,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());