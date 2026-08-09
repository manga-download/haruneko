import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mkzhan',
        title: 'mkzhan'
    },
    container: {
        url: 'https://www.mkzhan.com/214990/',
        id: '/214990/',
        title: '都市之逆天仙尊',
    },
    child: {
        id: '855316',
        title: '第1话 从异界回来了',
    },
    entry: {
        index: 0,
        size: 101_678,
        type: 'image/webp'
    }
}).AssertWebsite();