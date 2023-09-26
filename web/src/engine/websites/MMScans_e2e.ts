import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mmscans',
        title: 'MMSCANS'
    },
    container: {
        url: 'https://mm-scans.org/manga/eleceed12312/',
        id: JSON.stringify({ post: '1862', slug: '/manga/eleceed12312/' }),
        title: 'Eleceed'
    },
    child: {
        id: '/manga/eleceed12312/1/86/',
        title: 'Chapter 86'
    },
    entry: {
        index: 0,
        size: 5_265_933,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());