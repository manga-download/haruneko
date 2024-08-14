import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'scambertraslator',
        title: 'ScamberTraslator'
    },
    container: {
        url: 'https://visorscamber-scans.com/manga/boticario-misterioso/',
        id: JSON.stringify({ post: '1905', slug: '/manga/boticario-misterioso/' }),
        title: 'Boticario Misterioso'
    },
    child: {
        id: '/manga/boticario-misterioso/capitulo-127/',
        title: 'Capitulo 127'
    },
    entry: {
        index: 1,
        size: 491_789,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());