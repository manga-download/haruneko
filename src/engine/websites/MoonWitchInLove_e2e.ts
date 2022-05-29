import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'moonwitchinlove',
        title: 'Moon Witch In Love'
    }/*,
    container: {
        url: 'https://moonwitchinlove.com/manga/.../',
        id: JSON.stringify({ post: '0', slug: '/manga/.../' }),
        title: 'Manga ?'
    },
    child: {
        id: '/manga/.../.../',
        title: 'Chapter ?'
    },
    entry: {
        index: 0,
        size: -1,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());