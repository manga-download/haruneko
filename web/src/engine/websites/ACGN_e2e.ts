import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'acgn',
        title: '動漫戲說(ACGN.cc) - 免費線上漫畫,遊戲',
    },
    container: {
        url: 'https://comic.acgn.cc/manhua-haiziwang.htm',
        id: '/manhua-haiziwang.htm',
        title: '孩子王'
    },
    child: {
        id: '/view-45424.htm',
        title: '第01卷'
    },
    entry: {
        index: 0,
        size: 122_648,
        type: 'image/jpeg'
    }
}).AssertWebsite();