import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'astreascans',
        title: 'Astrea Scans'
    },
    container: {
        url: 'https://astreascans.com/manga/sehrin-ilahi-buyuk-ustasi/',
        id: '/manga/sehrin-ilahi-buyuk-ustasi/',
        title: 'Şehrin İlahi Büyük Ustası'
    },
    child: {
        id: '/manga/sehrin-ilahi-buyuk-ustasi/bolum-1/',
        title: 'bölüm 1'
    },
    entry: {
        index: 0,
        size: 256_024,
        type: 'image/webp'
    }
}).AssertWebsite();