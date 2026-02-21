import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangagezgini',
        title: 'Manga Gezgini'
    },
    container: {
        url: 'https://mangagezgini.online/manga/secilmis-kisi/',
        id: JSON.stringify({ post: '5486', slug: '/manga/secilmis-kisi/' }),
        title: 'Seçilmiş Kişi'
    },
    child: {
        id: '/manga/secilmis-kisi/bolum54/',
        title: 'Bölüm 54'
    },
    entry: {
        index: 0,
        size: 962_427,
        type: 'image/jpeg'
    }
}).AssertWebsite();