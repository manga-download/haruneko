import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manwe',
        title: 'ManWe'
    },
    container: {
        url: 'https://manwe.pro/manga/meow-rangers/',
        id: JSON.stringify({ post: '4920', slug: '/manga/meow-rangers/' }),
        title: 'Meow Rangers'
    },
    child: {
        id: '/manga/meow-rangers/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 301_481,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());