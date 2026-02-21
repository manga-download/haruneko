import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture( {
    plugin: {
        id: 'piescans',
        title: 'PieScans'
    },
    container: {
        url: 'https://piescans.com/manga/the-blooming-violet-in-the-back-garden/',
        id: '/manga/the-blooming-violet-in-the-back-garden/',
        title: 'The Blooming Violet in the Back Garden'
    },
    child: {
        id: '/the-blooming-violet-in-the-back-garden-bolum-0/',
        title: 'Bölüm 0'
    },
    entry: {
        index: 0,
        size: 223_151,
        type: 'image/jpeg'
    }
}).AssertWebsite();