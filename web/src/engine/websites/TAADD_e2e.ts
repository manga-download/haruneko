import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'taadd',
        title: 'TAADD'
    },
    container: {
        url: 'https://www.taadd.com/book/One+Piece.html',
        id: '/book/One+Piece.html',
        title: 'One Piece',
    },
    child: {
        id: '/chapter/OnePieceChapter1086/8624347/',
        title: 'Chapter 1086',
    },
    entry: {
        index: 0,
        size: 914_447,
        type: 'image/jpeg'
    }
}).AssertWebsite();