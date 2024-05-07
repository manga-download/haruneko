import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sukima',
        title: 'Sukima'
    },
    container: {
        url: 'https://www.sukima.me/book/title/BT0001051812/',
        id: 'BT0001051812',
        title: 'ボーイズ・オン・ザ・ラン',
        timeout: 10000
    },
    child: {
        id: '/bv/t/BT0001051812/v/1/s/1/p/1',
        title: '(001-0001)第1話 (1)'
    },
    entry: {
        index: 0,
        size: 1_062_402,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());