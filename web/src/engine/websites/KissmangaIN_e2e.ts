import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kissmangain',
        title: 'Kissmanga'
    },
    container: {
        url: 'https://kissmanga.in/kissmanga/one-piece-kpp/',
        id: JSON.stringify({ post: '274', slug: '/kissmanga/one-piece-kpp/' }),
        title: 'One Piece'
    },
    child: {
        id: '/kissmanga/one-piece-kpp/chapter-1-romance-dawn/',
        title: 'Chapter 1 Romance Dawn'
    },
    entry: {
        index: 0,
        size: 167_502,
        type: 'image/jpeg'
    }
}).AssertWebsite();