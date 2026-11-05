import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaoni',
        title: 'MangaOni'
    },
    container: {
        url: 'https://manga-oni.com/manga/one-piece/',
        id: '/manga/one-piece/',
        title: 'One Piece'
    },
    child: {
        id: '/lector/one-piece/334745/',
        title: 'Capítulo 1100 — Gracias por Todo, Bonney'
    },
    entry: {
        index: 0,
        size: 191_896,
        type: 'image/webp'
    }
}).AssertWebsite();