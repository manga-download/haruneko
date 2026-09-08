import { TestFixture } from '../../../test/WebsitesFixture';

// CASE : English chapter
new TestFixture({
    plugin: {
        id: 'mangakawaii',
        title: 'MangaKawaii',
    },
    container: {
        url: 'https://www.mangakawaii.io/manga/the-strongest-god-king',
        id: '/manga/the-strongest-god-king',
        title: 'The Strongest God King',
        timeout: 15000

    },
    child: {
        id: '/manga/the-strongest-god-king/en/331',
        title: 'Chapter 331 [en]'
    },
    entry: {
        index: 0,
        size: 129_069,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE : French chapter
new TestFixture({
    plugin: {
        id: 'mangakawaii',
        title: 'MangaKawaii',
    },
    container: {
        url: 'https://www.mangakawaii.io/manga/the-strongest-god-king',
        id: '/manga/the-strongest-god-king',
        title: 'The Strongest God King',
        timeout: 15000

    },
    child: {
        id: '/manga/the-strongest-god-king/fr/210',
        title: 'Chap. 210 [fr]'
    },
    entry: {
        index: 2,
        size: 221_425,
        type: 'image/jpeg'
    }
}).AssertWebsite();