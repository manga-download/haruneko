import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaball',
        title: 'MangaBall'
    },
    container: {
        url: 'https://mangaball.com/title-detail/one-piece-68515540702284f8341784c8',
        id: 'one-piece-68515540702284f8341784c8',
        title: 'One Piece',
        timeout: 20_000
    },
    child: {
        id: '69ee2ccbc01e2cf095f74905',
        title: 'Chapter 1181.5 [Rayquaza] [vi]'
    },
    entry: {
        index: 1,
        size: 310_289,
        type: 'image/jpeg'
    }
}).AssertWebsite();