import { TestFixture } from '../../../test/WebsitesFixture';

//Case : scrambled pictures
new TestFixture({
    plugin: {
        id: 'mangakimi',
        title: 'MangaKimi',
    },
    container: {
        url: 'https://www.mangakimi.com/manga/a-villainess-for-the-tyrant/',
        id: '/manga/a-villainess-for-the-tyrant/',
        title: 'A Villainess for the Tyrant'
    },
    child: {
        id: '/a-villainess-for-the-tyrant-104/',
        title: 'Chapter 104'
    },
    entry: {
        index: 4,
        size: 1_212_603,
        type: 'image/png'
    }
}).AssertWebsite();

//Case : ts_reader (regular mangastream)
new TestFixture({
    plugin: {
        id: 'mangakimi',
        title: 'MangaKimi',
    },
    container: {
        url: 'https://www.mangakimi.com/manga/douluo-dalu-5-rebirth-of-tang-san/',
        id: '/manga/douluo-dalu-5-rebirth-of-tang-san/',
        title: 'Douluo Dalu 5 – Rebirth of Tang San'
    },
    child: {
        id: '/douluo-dalu-5-rebirth-of-tang-san-172/',
        title: 'Chapter 172'
    },
    entry: {
        index: 1,
        size: 40_453,
        type: 'image/jpeg'
    }
}).AssertWebsite();