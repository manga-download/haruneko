import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangalivreblog',
        title: 'MangaLivre (.blog)',
    },
    container: {
        url: 'https://mangalivre.blog/manga/isekai-de-tochi-o-katte-noujou-o-tsukurou/',
        id: '/manga/isekai-de-tochi-o-katte-noujou-o-tsukurou/',
        title: 'Isekai de Tochi o Katte Noujou o Tsukurou'
    },
    child: {
        id: '/capitulo/isekai-de-tochi-o-katte-noujou-o-tsukurou-capitulo-65/',
        title: 'Capítulo 65'
    },
    entry: {
        index: 0,
        size: 148_525,
        type: 'image/jpeg'
    }
}).AssertWebsite();