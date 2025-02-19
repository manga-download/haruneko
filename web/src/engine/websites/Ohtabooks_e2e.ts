import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'ohtabooks',
        title: 'Ohtabooks'
    },
    container: {
        url: 'https://webcomic.ohtabooks.com/kumazo/',
        id: '/kumazo/',
        title: 'クマ蔵とゲームなご主人',
    },
    child: {
        id: 'https://yondemill.jp/contents/55155?view=1&u0=1',
        title: '第1話「ご主人とゲーム」',
        timeout: 10000
    }, /*since page id redirect to another url, test is failing despites us getting images
    https://yondemill.jp/contents/55155?view=1&u0=1' redirect to https://binb.bricks.pub/contents/b0baf48e-9a1e-4ac7-b331-f4b978714dc7_1673856049/speed_reader
    entry: {
        index: 0,
        size: 1_385_998,
        type: 'image/png'
    }*/
};

new TestFixture(config).AssertWebsite();