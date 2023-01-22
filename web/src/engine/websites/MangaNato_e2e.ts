import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manga-nato',
        title: 'Manga Nato'
    }/*,
    container: {
        url: 'https://manga-nato.com/manga/.../',
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