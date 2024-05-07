import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'finalscans',
        title: 'Final Scans'
    },
    container: {
        url: 'https://finalscans.com/manga/crimson-karma/',
        id: JSON.stringify({ post: '1855', slug: '/manga/crimson-karma/' }),
        title: 'Crimson Karma'
    },
    child: {
        id: '/manga/crimson-karma/capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 572_182,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());