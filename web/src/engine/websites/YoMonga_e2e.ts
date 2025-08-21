import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yomonga',
        title: 'YoMonga'
    },
    container: {
        url: 'https://www.yomonga.com/titles/306/',
        id: '/titles/306/',
        title: '部長と社畜の恋はもどかしい'
    },
    child: {
        id: '/titles/306/?episode=1&cid=2823',
        title: 'Chapter.1_1巻',
        timeout: 20000
    },
    entry: {
        index: 0,
        size: 4_190_733,
        type: 'image/png'
    }
}).AssertWebsite();