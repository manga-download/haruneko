import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'merlinscans',
        title: 'Merlin Scans'
    },
    container: {
        url: 'https://merlinscans.com/manga/kale/',
        id: JSON.stringify({ post: '1024', slug: '/manga/kale/' }),
        title: 'Castle'
    },
    child: {
        id: '/manga/kale/bolum-106/',
        title: 'Bölüm 106'
    },
    entry: {
        index: 0,
        size: 219_279,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());