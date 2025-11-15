import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatilkisi',
        title: 'Tilki Scans'
    },
    container: {
        url: 'https://www.tilkiscans.com/manga/yasakli-yuce-buyucunun-reenkarnasyonu/',
        id: JSON.stringify({ post: '210', slug: '/manga/yasakli-yuce-buyucunun-reenkarnasyonu/' }),
        title: 'Yasaklı Yüce Büyücünün Reenkarnasyonu'
    },
    /*  Captcha on chapter
    child: {
        id: '/manga/yasakli-yuce-buyucunun-reenkarnasyonu/bolum-66/',
        title: 'Bölüm 66'
    },
    entry: {
        index: 1,
        size: 346_236,
        type: 'image/webp'
    }*/
}).AssertWebsite();