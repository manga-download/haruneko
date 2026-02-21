import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaplustv',
        title: 'MangaPlus.tv'
    },
    container: {
        url: 'https://mangaplus.shueisha.tv/truyen-tranh/one-piece-1-en',
        id: '/truyen-tranh/one-piece-1-en',
        title: 'One Piece'
    },
    child: {
        id: '/truyen-tranh/ONE-PIECE-1-chap-1116-es.html',
        title: 'Capítulo 1116'
    },
    entry: {
        index: 0,
        size: 335_171,
        type: 'image/jpeg'
    }
}).AssertWebsite();