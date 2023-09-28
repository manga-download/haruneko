import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangakitsu',
        title: 'Manga Kitsu'
    },
    container: {
        url: 'https://mangakitsu.com/manga/manhwa-marry-my-husband-8/',
        id: JSON.stringify({ post: '303', slug: '/manga/manhwa-marry-my-husband-8/'}),
        title: 'Marry My Husband'
    },
    child: {
        id: '/manga/manhwa-marry-my-husband-8/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 370_592,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());