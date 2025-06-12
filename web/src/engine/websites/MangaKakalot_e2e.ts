import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangakakalot',
        title: 'MangaKakalot'
    },
    container: {
        url: 'https://www.mangakakalot.gg/manga/my-crazy-journalist-wife',
        id: '/manga/my-crazy-journalist-wife',
        title: 'My Crazy Journalist Wife'
    },
    child: {
        id: '/manga/my-crazy-journalist-wife/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 240_002,
        type: 'image/webp'
    }
}).AssertWebsite();