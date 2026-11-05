import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'sereinscan',
        title: 'Serein Scan'
    },
    container: {
        url: 'https://sereinscan.com/manga/ashtarte/',
        id: '/manga/ashtarte/',
        title: 'Ashtarte'
    },
    child: {
        id: '/ashtarte-bolum-95-ek-bolum-10-final/',
        title: 'Chapter 95 - Ek Bölüm 10 - Final',
        timeout: 10000
    },
    entry: {
        index: 0,
        size: 295_278,
        type: 'image/jpeg'
    }
}).AssertWebsite();