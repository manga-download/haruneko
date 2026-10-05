import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'moondaisyscans',
        title: 'Moon Daisy Scans'
    },
    container: {
        url: 'https://moondaisyscans.pro/manga/500cc/',
        id: '/manga/500cc/',
        title: '500CC'
    },
    child: {
        id: '/500cc-1-bolum/',
        title: 'Bölüm 1',
        timeout: 10_000
    },
    entry: {
        index: 1,
        size: 493_574,
        type: 'image/jpeg'
    }
}).AssertWebsite();