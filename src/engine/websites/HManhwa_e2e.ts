import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hmanhwa',
        title: 'HManhwa'
    },
    container: {
        url: 'https://hmanhwa.com/manhwa/between-us-english/',
        id: JSON.stringify({ post: '1945', slug: '/manhwa/between-us-english/' }),
        title: 'Between Us [English]'
    },
    child: {
        id: '/manhwa/between-us-english/1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 543_674,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());