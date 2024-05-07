import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'reaperscansfr',
        title: 'Reaper Scans (French)'
    },
    /* CloudFlare
    container: {
        url: 'https://reaperscans.fr/serie/perfect-surgeon/',
        id: JSON.stringify({ post: '212', slug: '/serie/perfect-surgeon/' }),
        title: 'Perfect Surgeon'
    },
    child: {
        id: '/serie/perfect-surgeon/chapitre-46/',
        title: 'Chapitre 46'
    },
    entry: {
        index: 2,
        size: 1_809_155,
        type: 'image/jpeg'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());