import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';
const config: Config = {
    plugin: {
        id: 'comiconlinefree',
        title: 'ComicOnlineFree'
    },
    container: {
        url: 'https://comiconlinefree.org/comic/avengers-spotlight',
        id: '/comic/avengers-spotlight',
        title: 'Avengers: Spotlight'
    },
    child: {
        id: '/avengers-spotlight/issue-full/full',
        title: '#Full'
    },
    entry: {
        index: 0,
        size: 492_586,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());