import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comicdom',
        title: 'ComicDom'
    },
    container: {
        url: 'https://comicdom.org/manga/absolute-martial-arts/',
        id: JSON.stringify({ post: '2463', slug: '/manga/absolute-martial-arts/' }),
        title: 'Absolute Martial Arts'
    },
    child: {
        id: '/manga/absolute-martial-arts/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 186_361,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());