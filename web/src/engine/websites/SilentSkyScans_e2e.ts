import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'silentskyscans',
        title: 'SilentSkyScans'
    },
    container: {
        url: 'https://reader.silentsky-scans.net/series/gto/',
        id: '/series/gto/',
        title: 'GTO'
    },
    child: {
        id: '/read/gto/en/4/0/',
        title: 'Vol.4 Vol 4'
    },
    entry: {
        index: 0,
        size: 328_157,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());