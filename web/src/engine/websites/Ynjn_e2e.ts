import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ynjn',
        title: 'ヤンジャン！(ynjn)'
    },
    container: {
        url: 'https://ynjn.jp/title/9459',
        id: '9459',
        title: 'ジョジョの奇妙な冒険 第9部'
    },
    child: {
        id: '195033',
        title: '#001 出発（DEPARTURE）'
    },
    entry: {
        index: 0,
        size: 3_339_547,
        type: 'image/png'
    }
}).AssertWebsite();