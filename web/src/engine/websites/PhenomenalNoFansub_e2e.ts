import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'phenomenalnofansub',
        title: 'Phenomenal No Fansub'
    }/*,
    container: {
        url: 'https://phenomenalnofansub.com/manga/.../',
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