import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'drecomics',
        title: 'DRE Comics'
    },
    container: {
        url: 'https://drecom-media.jp/drecomics/series/kakuresaijo',
        id: '/drecomics/series/kakuresaijo',
        title: '隠れ才女は全然めげない'
    },
    child: {
        id: '/viewer/e/123',
        title: '第1話①'
    },
    entry: {
        index: 4,
        size: 1_955_806,
        type: 'image/png'
    }
}).AssertWebsite();