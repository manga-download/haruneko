import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ynjn',
        title: 'ヤンジャン！(ynjn)'
    },
    container: {
        url: 'https://ynjn.jp/title/9459',
        id: '9459',
        title: 'ジョジョの奇妙な冒険 第9部'
    },
    child: {
        id: '195033',
        title: '#001 ★出発（DEPARTURE）'
    },
    entry: {
        index: 0,
        size: 3_014_106,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());