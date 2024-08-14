import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());