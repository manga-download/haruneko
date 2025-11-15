import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'qimeitj',
        title: 'Qimeitj'
    },
    container: {
        url: 'https://hxy4.com/book/2324',
        id: '/book/2324',
        title: '后宫太多，只好飞升了'
    },
    child: {
        id: '/chapter/144045',
        title: '035.5 洞天之内',
    },
    entry: {
        index: 0,
        size: 212_602,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();