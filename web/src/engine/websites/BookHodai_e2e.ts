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
    },
    child: {
        id: '/viewer?book_id=2000035407&branch_no=02&book_type=3',
        title: '85号',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 4_122_795,
        type: 'image/png',
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
    },
    child: {
        id: '/viewer?book_id=3000099022&branch_no=01&book_type=4',
        title: '1 ～ 44',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 4_319_976,
        type: 'image/png',
    }
}).AssertWebsite();