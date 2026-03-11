import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'inmanga',
        title: 'InManga'
    },
    container: {
        url: 'https://inmanga.com/ver/manga/One-Piece/dfc7ecb5-e9b3-4aa5-a61b-a498993cd935',
        id: '/ver/manga/One-Piece/dfc7ecb5-e9b3-4aa5-a61b-a498993cd935',
        title: 'One Piece'
    },
    child: {
        id: '/ver/manga/One-Piece/1074/11BBA49C-1512-4A47-839F-B4D6BE007B1E',
        title: '1,074'
    },
    entry: {
        index: 1,
        size: 360_478,
        type: 'image/jpeg'
    }
}).AssertWebsite();