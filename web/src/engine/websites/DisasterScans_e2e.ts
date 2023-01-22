import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'disasterscans',
        title: 'Disaster Scans'
    },
    container: {
        url: 'https://disasterscans.com/manga/yuan-zun/',
        id: JSON.stringify({ post: '155', slug: '/manga/yuan-zun/' }),
        title: 'Yuan Zun'
    },
    child: {
        id: '/manga/yuan-zun/chapter-1/',
        title: 'Chapter 1 - The Saint Dragon Of Zhou Family'
    },
    entry: {
        index: 0,
        size: 92_454,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());