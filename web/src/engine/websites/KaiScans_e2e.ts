import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'kaiscans',
        title: 'Kai Scans'
    },
    container: {
        url: 'https://www.kaiscans.com/series/hybrid/',
        id: '/series/hybrid/',
        title: 'Hybrid'
    },
    child: {
        id: '/hybrid-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 1_358_261,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());