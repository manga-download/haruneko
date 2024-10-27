import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangakakalot',
        title: 'MangaKakalot'
    },
    container: {
        url: 'https://mangakakalot.com/manga/rd923340',
        id: '/manga/rd923340',
        title: 'My Crazy Journalist Wife'
    },
    child: {
        id: '/chapter/rd923340/chapter_1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 2_216_516,
        type: 'image/jpeg'
    }
}).AssertWebsite();