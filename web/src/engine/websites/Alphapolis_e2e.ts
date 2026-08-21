import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Official
new TestFixture({
    plugin: {
        id: 'alphapolis',
        title: 'ALPHAPOLIS (アルファポリス)'
    },
    container: {
        url: 'https://www.alphapolis.co.jp/manga/official/777000246',
        id: '/manga/official/777000246',
        title: '令嬢はまったりをご所望。',
        timeout: 10_000
    },
    child: {
        id: '/manga/official/777000246/2888',
        title: '第1回'
    },
    /* picture size keep changing
    entry: {
        index: 0,
        size: 2_019_877,
        type: 'image/png'
    }*/
}).AssertWebsite();

// CASE: Unofficial
new TestFixture({
    plugin: {
        id: 'alphapolis',
        title: 'ALPHAPOLIS (アルファポリス)'
    },
    container: {
        url: 'https://www.alphapolis.co.jp/manga/853344814/118889164',
        id: '/manga/853344814/118889164',
        title: 'そのフラグをへし折りたい！'
    },
    child: {
        id: '/manga/853344814/118889164/episode/8516663',
        title: '闇に光るツーマンセル【1】'
    },
    entry: {
        index: 0,
        size: 217_919,
        type: 'image/jpeg'
    }
}).AssertWebsite();