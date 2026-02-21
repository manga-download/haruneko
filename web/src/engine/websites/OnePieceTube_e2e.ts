import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'onepiecetube',
        title: 'One Piece Tube'
    },
    container: {
        url: 'https://onepiece.tube/manga/kapitel-mangaliste',
        id: '/manga/kapitel-mangaliste',
        title: 'One Piece (jap. ワンピース)'
    },
    child: {
        id: '/manga/kapitel/1168/1',
        title: '1168 Elbans Schnee'
    },
    entry: {
        index: 0,
        size: 953_253,
        type: 'image/png'
    }
}).AssertWebsite();