import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'cocorip',
        title: 'Cocorip'
    },
    container: {
        url: 'https://cocorip.net/manga/cancion-tabu/',
        id: JSON.stringify({ post: '4056', slug: '/manga/cancion-tabu/' }),
        title: 'El tigre y la zorra DESCENSURADO'
    },
    child: {
        id: '/manga/cancion-tabu/capitulo-14/',
        title: 'Capitulo 14'
    },
    entry: {
        index: 1,
        size: 1_525_878,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());