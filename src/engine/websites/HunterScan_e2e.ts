import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hunterscan',
        title: 'Hunters Scan'
    },
    container: {
        url: 'https://huntersscan.xyz/series/grand-general/',
        id: JSON.stringify({ post: '182', slug: '/series/grand-general/' }),
        title: 'Grand General'
    },
    child: {
        id: '/series/grand-general/capitulo-00/',
        title: 'Capítulo 00'
    },
    entry: {
        index: 0,
        size: 1_030_060,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());