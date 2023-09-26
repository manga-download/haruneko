import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangatx',
        title: 'Mangatx'
    },
    container: {
        url: 'https://mangatx.com/manga/the-knight-king-who-returned-with-a-god/',
        id: JSON.stringify({ post: '10243', slug: '/manga/the-knight-king-who-returned-with-a-god/' }),
        title: 'The Knight King Who Returned with a God'
    },
    child: {
        id: '/manga/the-knight-king-who-returned-with-a-god/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 1_675_411,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());