import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'skymanga',
        title: 'Sky Manga'
    }/*,
    container: {
        url: 'https://skymanga.co/manga/.../',
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