import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comicsvalley',
        title: 'Comics Valley'
    }/*,
    container: {
        url: 'https://comicsvalley.com/manga/.../',
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