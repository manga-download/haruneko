import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'arenascan',
        title: 'Arena Scan'
    },
    container: {
        url: 'https://arenascan.com/manga/rank-no-ura-soubi-musou/',
        id: '/manga/rank-no-ura-soubi-musou/',
        title: '??? Rank no Ura Soubi Musou'
    },
    child: {
        id: '/rank-no-ura-soubi-musou-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 441_279,
        type: 'image/jpeg'
    }
}).AssertWebsite();