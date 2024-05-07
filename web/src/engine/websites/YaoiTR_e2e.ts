import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'yaoitr',
        title: 'YaoiTR'
    },
    container: {
        url: 'https://yaoitr.online/manga/under-the-green-light/',
        id: JSON.stringify({ post: '242', slug: '/manga/under-the-green-light/' }),
        title: 'Under The Green Light'
    },
    child: {
        id: '/manga/under-the-green-light/bolum-58/',
        title: 'Bölüm 58'
    }, /* //Login needed
    entry: {
        index: 0,
        size: -1,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());