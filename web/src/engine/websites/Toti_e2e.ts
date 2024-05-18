import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'toti',
        title: 'To-Ti'
    },
    container: {
        url: 'https://to-ti.in/product/yasegaman',
        id: '/product/yasegaman',
        title: '痩我慢の説'
    },
    child: {
        id: '/story/yasegaman01',
        title: '第１話'
    },
    entry: {
        index: 0,
        size: 410_238,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());