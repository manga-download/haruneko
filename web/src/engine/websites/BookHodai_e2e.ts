import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'bookhodai',
        title: 'BookHodai'
    },
    container: {
        url: 'https://bookhodai.jp/magazine/backnumber/1029551',
        id: '/magazine/backnumber/1029551',
        title: 'comicグラスト',
        timeout: 15000

    },
    child: {
        id: '/viewer?book_id=2000035407&branch_no=01&book_type=3',
        title: 'vol.85',
        timeout: 20000
    },
    entry: {
        index: 0,
        size: 3_984_399,
        type: 'image/png',
        timeout: 30000

    }
}).AssertWebsite();

new TestFixture({
    plugin: {
        id: 'bookhodai',
        title: 'BookHodai'
    },
    container: {
        url: 'https://bookhodai.jp/manga/backnumber/62789',
        id: '/manga/backnumber/62789',
        title: '風光る',
        timeout: 15000

    },
    child: {
        id: '/viewer?book_id=3000099022&branch_no=01&book_type=4',
        title: '1 ～ 44',
        timeout: 20000
    },
    entry: {
        index: 0,
        size: 4_011_228,
        type: 'image/png',
        timeout: 30000
    }
}).AssertWebsite();