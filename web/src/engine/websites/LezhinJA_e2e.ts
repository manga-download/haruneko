import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lezhin-ja',
        title: 'Lezhin (Japanese)'
    },
    container: {
        url: 'https://www.lezhin.jp/ja/comic/elfyaserarennaiyo',
        id: '/ja/comic/elfyaserarennaiyo',
        title: `エルフさんは痩せられない。【フルカラー縦スクロール版】`
    },
    child: {
        id: '/ja/comic/elfyaserarennaiyo/1',
        title: '1話',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 45_290,
        type: 'image/webp'
    }
}).AssertWebsite();