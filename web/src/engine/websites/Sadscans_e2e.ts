import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sadscans',
        title: 'Sadscans'
    },
    container: {
        url: 'https://sadscans.net/seriler/one-piece',
        id: '/seriler/one-piece',
        title: 'One Piece'
    },
    child: {
        id: '/reader/641c309d0406b',
        title: '1079. Bölüm - Kızıl Saç Korsanları - Bir İmparator\'un Tayfası'
    },
    entry: {
        index: 0,
        size: 234_180,
        type: 'image/png'
    }
}).AssertWebsite();