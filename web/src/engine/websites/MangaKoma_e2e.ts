import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangakoma',
        title: 'Manga Koma',
    },
    container: {
        url: 'https://raw1001.net/manga/apunea-te-ming-ke-zhan-shi-piao-liu-ji',
        id: '/manga/apunea-te-ming-ke-zhan-shi-piao-liu-ji',
        title: 'アプネア ～特命課戦史漂流記～',
    },
    child: {
        id: '/manga/apunea-te-ming-ke-zhan-shi-piao-liu-ji/di14hua',
        title: '第14話',
    },
    entry: {
        index: 0,
        size: 299_912,
        type: 'image/webp',
    }
}).AssertWebsite();