import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'resetscans',
        title: 'Reset Scans'
    },
    container: {
        url: 'https://reset-scans.xyz/manga/the-ultimate-of-all-ages/',
        id: JSON.stringify({ post: '2313', slug: '/manga/the-ultimate-of-all-ages/' }),
        title: 'The Ultimate of All Ages'
    },
    child: {
        id: '/manga/the-ultimate-of-all-ages/chapter-001/',
        title: 'Chapter 001'
    },
    entry: {
        index: 1,
        size: 3_230_931,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());