import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'arthurscan',
        title: 'Arthur Scan'
    },
    container: {
        url: 'https://arthurscan.xyz/manga/return-of-soul-master/',
        id: JSON.stringify({ post: '2379', slug: '/manga/return-of-soul-master/' }),
        title: 'Return of Soul Master'
    },
    child: {
        id: '/manga/return-of-soul-master/capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 0,
        size: 1_320_053,
        type: 'image/jpeg'
    }
}).AssertWebsite();