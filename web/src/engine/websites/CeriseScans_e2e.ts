import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'cerisescans',
        title: 'Cerise Scans'
    },
    container: {
        url: 'https://cerisescan.net/manga/45/',
        id: JSON.stringify({ post: '45', slug: '/manga/45/' }),
        title: 'Apenas Me Deixe em Paz'
    },
    child: {
        id: '/manga/45/cap-01/',
        title: 'Cap. 01',
    },
    entry: {
        index: 0,
        size: 1_424_016,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());