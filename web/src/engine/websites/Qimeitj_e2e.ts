import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'qimeitj',
        title: 'Qimeitj'
    },
    container: {
        url: 'https://hxy4.com/manhua/126399',
        id: '/manhua/126399',
        title: '游戏人生 东部联合篇'
    },
    child: {
        id: '/chapter/1670880',
        title: '第1话',
    },
    entry: {
        index: 0,
        size: 127_869,
        type: 'image/jpeg'
    }
}).AssertWebsite();