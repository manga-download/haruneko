import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangapark',
        title: 'MangaPark'
    },
    container: {
        url: 'https://mangapark.org/title/10953-en-one-piece',
        id: '/title/10953-en-one-piece',
        title: 'One Piece'
    },
    child: {
        id: '/title/10953-en-one-piece/9625399-vol-tbe-ch-1146',
        title: 'Vol.TBE Ch.1146'
    },
    entry: {
        index: 1,
        size: 276_869,
        type: 'image/jpeg'
    }
}).AssertWebsite();