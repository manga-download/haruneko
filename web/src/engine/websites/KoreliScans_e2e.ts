import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'koreliscans',
        title: 'Koreli Scans'
    },
    container: {
        url: 'https://koreliscans.com/manga/gorunusculuk/',
        id: JSON.stringify({ post: '3038', slug: '/manga/gorunusculuk/' }),
        title: 'Lookism'
    },
    child: {
        id: '/manga/gorunusculuk/bolum-550/',
        title: 'Bölüm 550'
    },
    entry: {
        index: 0,
        size: 1_211_298,
        type: 'image/webp'
    }
}).AssertWebsite();