import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'fallenangelsscans',
        title: 'FallenAngelsScans'
    },
    container: {
        url: 'https://manga.fascans.com/manga/29-to-jk',
        id: '/manga/29-to-jk',
        title: '29 to JK'
    },
    child: {
        id: '/manga/29-to-jk/19',
        title: '19'
    },
    entry: {
        index: 1,
        size: 312_125,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());