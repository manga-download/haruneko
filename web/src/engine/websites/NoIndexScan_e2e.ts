import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'noindexscan',
        title: 'No Index Scan'
    },
    container: {
        url: 'https://noindexscan.com/manga/cctv/',
        id: JSON.stringify({ post: '5173', slug: '/manga/cctv/'}),
        title: 'CCTV'
    },
    child: {
        id: '/manga/cctv/cap-14/',
        title: 'Cap. 14'
    },
    entry: {
        index: 0,
        size: 451_271,
        type: 'image/jpeg'
    }
}).AssertWebsite();