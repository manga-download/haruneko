import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
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
        id: '/list/work/62591706776561c83f010000/episodes/1',
        title: '第1話',
        timeout: 10000
    },
    entry: {
        index: 0,
        size: 1_872_190,
        type: 'image/png'
    }
}).AssertWebsite();