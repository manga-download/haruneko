import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lhtranslation',
        title: 'LHTranslation'
    }/*,
    container: {
        url: 'https://lhtranslation.net/manga/.../',
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