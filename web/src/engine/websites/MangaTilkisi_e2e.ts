import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangatilkisi',
        title: 'Manga Tilkisi'
    }, /* CloudFlare
    container: {
        url: 'https://www.manga-tilkisi.com/manga/yasakli-yuce-buyucunun-reenkarnasyonu/',
        id: JSON.stringify({ post: '210', slug: '/manga/yasakli-yuce-buyucunun-reenkarnasyonu/' }),
        title: 'Yasaklı Yüce Büyücünün Reenkarnasyonu'
    },
    child: {
        id: '/manga/yasakli-yuce-buyucunun-reenkarnasyonu/bolum-66/',
        title: 'Bölüm 66'
    },
    entry: {
        index: 1,
        size: 346_236,
        type: 'image/webp'
    }*/
};

new TestFixture(config).AssertWebsite();