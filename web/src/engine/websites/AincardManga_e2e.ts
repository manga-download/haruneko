import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'aincardmanga',
        title: 'Aincard Manga'
    },
    container: {
        url: 'https://aincardmanga.com/manga/himitsu-no-akuma-barai/',
        id: JSON.stringify({ post: '719', slug: '/manga/himitsu-no-akuma-barai/' }),
        title: 'Himitsu no Akuma Barai'
    },
    /*  Login needed for chapter
    child: {
        id: '/manga/yasakli-yuce-buyucunun-reenkarnasyonu/bolum-66/',
        title: 'Bölüm 1 - Final - Sapkın Rahibe'
    },
    entry: {
        index: 0,
        size: 346_236,
        type: 'image/webp'
    }*/
}).AssertWebsite();