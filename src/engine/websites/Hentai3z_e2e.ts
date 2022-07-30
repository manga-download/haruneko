import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hentai3z',
        title: 'Hentai3z'
    },
    container: {
        url: 'https://hentai3z.com/manga/secret-class-8/',
        id: JSON.stringify({ post: '1464', slug: '/manga/secret-class-8/' }),
        title: 'Secret Class'
    },
    child: {
        id: '/manga/secret-class-8/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 41_812,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());