import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'futabanet',
        title: 'がうがうモンスター (Futabanet Monster)'
    },
    container: {
        url: 'https://gaugau.futabanet.jp/list/work/62591706776561c83f010000',
        id: '/list/work/62591706776561c83f010000',
        title: 'ポイントギフター《経験値分配能力者》の異世界最強ソロライフ～ブラックギルドから解放された男は万能最強職として無双する～'
    },
    child: {
        id: 'https://reader.futabanet.jp/62591706776561c83f010000_001-001_1?wurl=https%3A%2F%2Fgaugau.futabanet.jp%2Flist%2Fwork%2F62591706776561c83f010000',
        title: '第1話(1)'
    },
    entry: {
        index: 0,
        size: 1_850_824,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());