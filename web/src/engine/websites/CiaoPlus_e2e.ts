import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ciaoplus',
        title: 'Ciao Plus'
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
        index: 0,
        size: 1_974_905,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());