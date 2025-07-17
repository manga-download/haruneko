import { TestFixture } from '../../../test/WebsitesFixture';

// Case : episodes
new TestFixture({
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
        size: 1_533_305,
        type: 'image/png'
    }
}).AssertWebsite();

// Case : volumes
new TestFixture({
    plugin: {
        id: 'shonenjumpplus',
        title: `少年ジャンプ＋ (Shonen Jump +)`
    },
    container: {
        url: 'https://shonenjumpplus.com/volume/14079602755508629586',
        id: '/volume/14079602755508629586',
        title: 'ファントムバスターズ'
    }, /*
    child: {
        id: '/volume/14079602755508629586',
        title: '1'
    }
    /* paid content
    entry: {
        index: 0,
        size: -1,
        type: 'image/png'
    }*/
}).AssertWebsite();

// Case : magazines
new TestFixture({
    plugin: {
        id: 'shonenjumpplus',
        title: `少年ジャンプ＋ (Shonen Jump +)`
    },
    container: {
        url: 'https://shonenjumpplus.com/magazine/13933686331641398576',
        id: '/magazine/13933686331641398576',
        title: 'ジャンプNEXT!! デジタル'
    }, /* paid content
    child: {
        id: '/magazine/13933686331641398576',
        title: '2015 vol.1'
    },

    entry: {
        index: 0,
        size: -1,
        type: 'image/png'
    }*/
}).AssertWebsite();