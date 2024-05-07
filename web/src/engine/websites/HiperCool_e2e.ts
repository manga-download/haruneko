import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'hipercool',
        title: 'Hiper Cool'
    },
    container: {
        url: 'https://hipercool.xyz/manga/nama-hone-josou/',
        id: JSON.stringify({post: '19381', slug: '/manga/nama-hone-josou/' }),
        title: 'Nama-Hone Josou'
    },
    child: {
        id: '/manga/nama-hone-josou/vol-1/',
        title: 'Vol. 1'
    },
    entry: {
        index: 0,
        size: 325_942,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());