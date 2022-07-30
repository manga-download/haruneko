import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comichub',
        title: 'ComicOnline'
    },
    container: {
        url: 'https://comiconline.org/comic/batman-white-knight/',
        id: JSON.stringify({ post: '5913', slug: '/comic/batman-white-knight/' }),
        title: 'Batman: White Knight'
    },
    child: {
        id: '/comic/batman-white-knight/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 325_705,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());