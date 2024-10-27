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
        id: '/list/work/62591706776561c83f010000/episodes/1',
        title: '第1話',
        timeout: 10000
    },
    entry: {
        index: 0,
        size: 1_872_190,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();

const NoSpeedBinbConfig: Config = {
    plugin: {
        id: 'futabanet',
        title: 'がうがうモンスター (Futabanet Monster)'
    },
    container: {
        url: 'https://gaugau.futabanet.jp/list/work/oCMElLZtSKn7e5PVKDuV2josm',
        id: '/list/work/oCMElLZtSKn7e5PVKDuV2josm',
        title: 'ルーン魔術だけが取り柄の不憫令嬢、天才王子に溺愛される ～婚約者、仕事、成果もすべて姉に横取りされた地味な妹ですが、ある日突然立場が逆転しちゃいました～'
    },
    child: {
        id: '/list/work/oCMElLZtSKn7e5PVKDuV2josm/episodes/7',
        title: '第3話(3)',
    },
    entry: {
        index: 0,
        size: 204_914,
        type: 'image/jpeg'
    }
};

const NoSpeedBinbfixture = new TestFixture(NoSpeedBinbConfig);
describe(NoSpeedBinbfixture.Name, async () => (await NoSpeedBinbfixture.Connect()).AssertWebsite());