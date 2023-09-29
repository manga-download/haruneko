import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hunterscan',
        title: 'Hunters Scan'
    },
    container: {
        url: 'https://huntersscan.xyz/series/grand-general2232/',
        id: JSON.stringify({ post: '182', slug: '/series/grand-general2232/' }),
        title: 'Grand General'
    },
    child: {
        id: '/series/grand-general2232/capitulo-00-5/',
        title: 'Capítulo 00.5'
    },
    entry: {
        index: 0,
        size: 1_030_060,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());