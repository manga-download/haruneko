import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'bookhodai',
        title: 'BookHodai'
    },
    container: {
        url: 'https://bookhodai.jp/manga/backnumber/49775',
        id: '/manga/backnumber/49775',
        title: '色欲の春～秘めた色香は筆先に宿る～',
        timeout: 15000

    },
    child: {
        id: '/viewer?book_id=3000071024&branch_no=01&book_type=4',
        title: '1 ～ 24',
        timeout: 20000
    },
    entry: {
        index: 0,
        size: 2_198_237,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();