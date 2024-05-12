import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'dm5',
        title: 'DM5 漫画'
    },
    container: {
        url: 'https://www.dm5.com/manhua-mingmingyounanpengyoule/',
        id: '/manhua-mingmingyounanpengyoule/',
        title: '明明有男朋友了'
    },
    child: {
        id: '/m1274672/',
        title: '第1话'
    },
    entry: {
        index: 0,
        size: 143_096,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());