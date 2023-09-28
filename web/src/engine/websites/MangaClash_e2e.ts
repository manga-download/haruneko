import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaclash',
        title: 'Manga Clash'
    },
    container: {
        url: 'https://mangaclash.com/manga/trapped-in-a-webnovel-as-a-good-for-nothing/',
        id: JSON.stringify({ post: '20283', slug: '/manga/trapped-in-a-webnovel-as-a-good-for-nothing/' }),
        title: 'Trapped in a Webnovel as a Good for Nothing'
    },
    child: {
        id: '/manga/trapped-in-a-webnovel-as-a-good-for-nothing/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 1_146_187,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());