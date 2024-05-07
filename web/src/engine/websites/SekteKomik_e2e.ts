import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sektekomik',
        title: 'SEKTEKOMIK.XYZ'
    },
    container: {
        url: 'https://sektekomik.xyz/manga/existence',
        id: '/manga/existence',
        title: 'Existence'
    },
    child: {
        id: '/manga/existence/ch/62',
        title: 'Ch 62'
    },
    entry: {
        index: 1,
        size: 526_546,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());