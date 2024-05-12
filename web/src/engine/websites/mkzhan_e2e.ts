import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mkzhan',
        title: 'mkzhan'
    },
    container: {
        url: 'https://www.mkzhan.com/214990/',
        id: '/214990/',
        title: '都市之逆天仙尊',
    },
    child: {
        id: '855316',
        title: '第1话 从异界回来了',
    },
    entry: {
        index: 0,
        size: 77_152,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());