import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaball',
        title: 'MangaBall'
    },
    container: {
        url: 'https://mangaball.net/title-detail/one-piece-68515540702284f8341784c8/',
        id: '68515540702284f8341784c8',
        title: 'One Piece'
    },
    child: {
        id: '/chapter-detail/69ee2ccbc01e2cf095f74905/',
        title: 'Chương 1181.5 [vi]'
    },
    entry: {
        index: 1,
        size: 310_289,
        type: 'image/jpeg'
    }
}).AssertWebsite();