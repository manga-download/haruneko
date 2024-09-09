import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'noxscans',
        title: 'Nox Scans'
    },
    container: {
        url: 'https://noxscans.com/manga/nano-machine/',
        id: '/manga/nano-machine/',
        title: 'Nano Machine'
    },
    child: {
        id: '/nano-machine-bolum-222/',
        title: 'Bölüm 222'
    },
    entry: {
        index: 0,
        size: 133_188,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());