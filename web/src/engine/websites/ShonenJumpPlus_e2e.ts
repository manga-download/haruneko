import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'shonenjumpplus',
        title: `少年ジャンプ＋ (Shonen Jump +)`
    },
    container: {
        url: 'https://shonenjumpplus.com/episode/14079602755278384822',
        id: '/episode/14079602755278384822',
        title: '対世界用魔法少女つばめ'
    },
    child: {
        id: '/episode/14079602755278384822',
        title: '[第1話]'
    },
    entry: {
        index: 0,
        size: 1_532_801,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());