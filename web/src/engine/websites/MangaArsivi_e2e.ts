import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaarsivi',
        title: 'Manga Arşivi'
    },
    container: {
        url: 'https://manga-arsivi.com.tr/manga/son-seviye-aylak',
        id: 'son-seviye-aylak',
        title: 'Son Seviye Çaylak'
    },
    child: {
        id: '1777490833116',
        title: '253'
    },
    entry: {
        index: 0,
        size: 41_954,
        type: 'image/webp'
    }
}).AssertWebsite();