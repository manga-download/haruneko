import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangadiyari',
        title: 'MangaDiyari'
    },
    container: {
        url: 'https://mangadiyari.com/manga/olumsuz-imparatorun-yeniden-dogusu/',
        id: JSON.stringify({ post: '394', slug: '/manga/olumsuz-imparatorun-yeniden-dogusu/' }),
        title: `Ölümsüz İmparator'un Yeniden Doğuşu`
    },
    child: {
        id: '/manga/olumsuz-imparatorun-yeniden-dogusu/bolum-102/',
        title: 'Bölüm 102'
    },
    entry: {
        index: 1,
        size: 239_121,
        type: 'image/jpeg'
    }
}).AssertWebsite();