import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ciaoplus',
        title: 'Ciao Plus',
        timeout: 35_000
    },
    container: {
        url: 'https://ciao.shogakukan.co.jp/comics/title/00023/episode/22446',
        id: '23',
        title: '愛するあなたは推しで王様～異世界恋愛記～'
    },
    child: {
        id: '4035',
        title: '第1話　どうやら異世界に○○したらしい。'
    },
    entry: {
        index: 7,
        size: 1_050_614,
        type: 'image/png'
    }
}).AssertWebsite();

new TestFixture({
    plugin: {
        id: 'ciaoplus',
        title: 'Ciao Plus',
    },
    container: {
        url: 'https://ciao.shogakukan.co.jp/comics/title/00741/episode/32542',
        id: '741',
        title: 'でびるんしぇあはうすっ'
    },
    child: {
        id: '29612',
        title: 'シェアハウスしよう/じゃんけん/オムライス'
    },
    entry: {
        index: 8,
        size: 1_198_663,
        type: 'image/png'
    }
}).AssertWebsite();