import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'toptoonjp',
        title: 'TOPTOON (Japanese)'
    },
    container: {
        url: 'https://www.toptoon.jp/product/102721',
        id: '102721',
        title: 'MAMA'
    },
    child: {
        id: '137814',
        title: '1'
    },
    entry: {
        index: 0,
        size: 54_170,
        type: 'image/webp'
    }
}).AssertWebsite();