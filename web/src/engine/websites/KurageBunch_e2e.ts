import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'kuragebunch',
        title: `くらげバンチ (KurageBunch)`
    },
    container: {
        url: 'https://kuragebunch.com/episode/14079602755281406271',
        id: '/episode/14079602755281406271',
        title: '新月の皇子と戦奴隷 ～ダ・ヴィンチの孫娘～'
    },
    child: {
        id: '/episode/14079602755281406271',
        title: '新月の皇子と戦奴隷 ～ダ・ヴィンチの孫娘～'
    },
    entry: {
        index: 0,
        size: 4_123_363,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());