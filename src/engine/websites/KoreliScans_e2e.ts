import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'koreliscans',
        title: 'Koreli Scans'
    },
    container: {
        url: 'https://koreliscans.net/manga/lookism/',
        id: '/manga/lookism/',
        title: 'Lookism'
    },
    child: {
        id: '/lookism-bolum-550/',
        title: 'Bölüm 550'
    },
    entry: {
        index: 4,
        size: 818_988,
        type: 'image/webp'
    }
}).AssertWebsite();