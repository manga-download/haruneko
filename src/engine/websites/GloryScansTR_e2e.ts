import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'glory-scans',
        title: 'Glory-Scans'
    },
    container: {
        url: 'https://gloryscans.com/manga/ghost-gate/',
        id: JSON.stringify({ post: '536', slug: '/manga/ghost-gate/' }),
        title: 'Ghost Gate'
    },
    child: {
        id: '/manga/ghost-gate/bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 1_025_997,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());