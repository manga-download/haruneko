import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'corocoro',
        title: 'CoroCoro Online (コロコロオンライン)'
    },
    container: {
        url: 'https://www.corocoro.jp/episode/14079602755502771318',
        id: '/episode/14079602755502771318',
        title: '勝利の女神：NIKKE すいーとえんかうんと'
    },
    child: {
        id: '/episode/14079602755502771318',
        title: '[第1話]'
    },
    entry: {
        index: 0,
        size: 2_314_013,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());