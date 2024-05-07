import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hunterscan',
        title: 'Hunters Scan'
    },
    container: {
        url: 'https://huntersscan.xyz/series/civilizacao-de-nebula/',
        id: JSON.stringify({ post: '6001', slug: '/series/civilizacao-de-nebula/' }),
        title: 'Civilização de Nebula'
    },
    child: {
        id: '/series/civilizacao-de-nebula/capitulo-37/',
        title: 'Capítulo 37'
    },
    entry: {
        index: 1,
        size: 3_308_367,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());