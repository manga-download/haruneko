import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'eshadow',
        title: 'Eshadow'
    },
    container: {
        url: 'https://www.eshadow.net/manga/one-piece/',
        id: JSON.stringify({ post: '1843', slug: '/manga/one-piece/' }),
        title: 'One Piece'
    },
    child: {
        id: encodeURI('/manga/one-piece/الفصل-1154/').toLowerCase(),
        title: 'الفصل 1154 - لا أستطيع حتى الموت!!'
    },
    entry: {
        index: 0,
        size: 687_841,
        type: 'image/jpeg'
    }
}).AssertWebsite();