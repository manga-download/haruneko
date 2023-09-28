import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuaplus',
        title: 'ManhuaPlus'
    },
    container: {
        url: 'https://manhuaplus.com/manga/martial-peak/',
        id: JSON.stringify({ post: '1855', slug: '/manga/martial-peak/' }),
        title: 'Martial Peak'
    },
    child: {
        id: '/manga/martial-peak/chapter-500/',
        title: 'Chapter 500'
    },
    entry: {
        index: 0,
        size: 191_928,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());