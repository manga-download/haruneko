import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'urasunday',
        title: '裏サンデー (Ura Sunday)'
    },
    container: {
        url: 'https://urasunday.com/title/1749',
        id: '/title/1749',
        title: '最強女師匠たちが育成方針を巡って修羅場'
    },
    child: {
        id: '/title/1749/225480',
        title: '第39話(前編) - 制御不能',
    },
    entry: {
        index: 0,
        size: 113_326,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());