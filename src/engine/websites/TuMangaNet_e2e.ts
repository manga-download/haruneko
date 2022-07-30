import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tumanganet',
        title: 'Tu Manga Online'
    }/*,
    container: {
        url: 'https://tumanga.net/manga/.../',
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