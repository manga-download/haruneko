import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manga33',
        title: 'Manga33'
    },
    container: {
        url: 'https://www.manga333.com/manga/yuan-zun.html',
        id: '/manga/yuan-zun.html',
        title: 'Yuan Zun'
    },
    child: {
        id: '/manga/yuan-zun-510-all.html',
        title: 'Chapter 510'
    },
    entry: {
        index: 0,
        size: 191_444,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());