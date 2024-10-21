import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'reaperscansfr',
        title: 'Reaper Scans (French)'
    },
    /* CloudFlare
    container: {
        url: 'https://reaper-scans.fr/serie/4ba82a00e72/',
        id: '/serie/4ba82a00e72/',
        title: 'Solo Leveling'
    },
    child: {
        id: '/chapter/4ba82a00e72-3c7a1bde772/',
        title: 'Chapter 179'
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