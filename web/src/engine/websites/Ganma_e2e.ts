import { TestFixture } from '../../../test/WebsitesFixture';

// CASE : Regular content
new TestFixture({
    plugin: {
        id: 'ganma',
        title: 'GANMA!'
    },
    container: {
        url: 'https://ganma.jp/web/magazine/kyatapi',
        id: JSON.stringify({ magazineId: '5111fc10-5046-11ee-8042-c6601c61f7a6', isWebOnlySensitive: false }),
        title: 'きゃたぴランド'
    },
    child: {
        id: '8c1ab720-60cc-11ee-a11e-86ad1c7f6bc1',
        title: '第1話 しんそつ！！'
    },
    entry: {
        index: 0,
        size: 910_108,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE : Web only content
new TestFixture({
    plugin: {
        id: 'ganma',
        title: 'GANMA!'
    },
    container: {
        url: 'https://ganma.jp/web/magazine/doreizukan_web',
        id: JSON.stringify({ magazineId: 'bae1e2bf-220c-4a21-bb42-112a945bf8d2', isWebOnlySensitive: true }),
        title: '【WEB限定版】固有スキル「奴隷図鑑」'
    },
    child: {
        id: '4816ade0-3078-11f0-a503-3a60ae468aee',
        title: '1巻試し読み'
    },
    entry: {
        index: 0,
        size: 934_979,
        type: 'image/jpeg'
    }
}).AssertWebsite();