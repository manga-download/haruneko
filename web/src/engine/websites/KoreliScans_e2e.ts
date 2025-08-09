import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'koreliscans',
        title: 'Koreli Scans'
    },
    container: {
        url: 'https://koreliscans.net/manga/4354/',
        id: JSON.stringify({ post: '3038', slug: '/manga/4354/' }),
        title: 'Lookism'
    },
    child: {
        id: '/manga/4354/bolum-550/',
        title: 'Bölüm 550'
    },
    entry: {
        index: 0,
        size: 1_211_298,
        type: 'image/webp'
    }
}).AssertWebsite();