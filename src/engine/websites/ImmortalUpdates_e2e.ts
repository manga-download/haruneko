import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'immortalupdates',
        title: 'Immortal Updates'
    },
    container: {
        url: 'https://immortalupdates.com/manga/the-era-of-superhuman-one/',
        id: JSON.stringify({ post: '3229', slug: '/manga/the-era-of-superhuman-one/' }),
        title: 'Superhuman Era'
    },
    child: {
        id: '/manga/the-era-of-superhuman-one/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 163_621,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());