import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangamonk',
        title: 'MangaMonk'
    },
    container: {
        url: 'https://mangamonk.com/academys-undercover-professor',
        id: '/academys-undercover-professor',
        title: `Academy’s Undercover Professor`
    },
    child: {
        id: '/academys-undercover-professor/chapter-144',
        title: 'Chapter 144'
    },
    entry: {
        index: 1,
        size: 152_670,
        type: 'image/webp'
    }
}).AssertWebsite();