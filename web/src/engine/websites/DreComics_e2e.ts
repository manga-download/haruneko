import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
        size: 1_796_783,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();