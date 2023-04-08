import { TestFixture } from '../../../test/WebsitesFixture';

const fixture = new TestFixture({
    plugin: {
        id: 'manga3s',
        title: 'Manga3S'
    },
    container: {
        url: 'https://manga3s.com/manga/divine-urban-god/',
        id: JSON.stringify({ post: '3791', slug: '/manga/divine-urban-god/' }),
        title: 'Divine Urban God'
    },
    child: {
        id: '/manga/divine-urban-god/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 2,
        size: 97_936,
        type: 'image/jpeg'
    }
});
describe(fixture.Name, () => fixture.AssertWebsite());