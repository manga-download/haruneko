import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hscans',
        title: 'HSCANS'
    },
    container: {
        url: 'https://hscans.com/manga/sleeping-with-enemy/',
        id: JSON.stringify({ post: '231', slug: '/manga/sleeping-with-enemy/' }),
        title: 'Sleeping With Enemy'
    },
    child: {
        id: '/manga/sleeping-with-enemy/chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 854_503,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());