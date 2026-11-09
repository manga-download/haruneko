import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'amangaplanet',
        title: 'Amanga Planet'
    },
    container: {
        url: 'https://www.amangaplanet.com.tr/manga/seytani-cag/',
        id: '/manga/seytani-cag/',
        title: 'Şeytani Çağ'
    },
    child: {
        id: '/seytani-cag-bolum-1/',
        title: 'Bölüm 1',
        timeout: 10_000
    },
    entry: {
        index: 0,
        size: 170_650,
        type: 'image/webp'
    }
}).AssertWebsite();