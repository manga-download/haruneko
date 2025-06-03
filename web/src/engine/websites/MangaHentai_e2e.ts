import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangahentai',
        title: 'Manga Hentai'
    },
    container: {
        url: 'https://mangahentai.me/manga-hentai/an-outsiders-way-in/',
        id: JSON.stringify({ post: '153760', slug: '/manga-hentai/an-outsiders-way-in/' }),
        title: 'An Outsider’s Way In'
    },
    child: {
        id: '/manga-hentai/an-outsiders-way-in/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 2,
        size: 55_488,
        type: 'image/jpeg'
    }
}).AssertWebsite();