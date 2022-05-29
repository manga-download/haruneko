import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'fenixscanlator',
        title: 'Fênix Scanlator'
    }/*,
    container: {
        url: 'https://fenixscanlator.xyz/manga/.../',
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