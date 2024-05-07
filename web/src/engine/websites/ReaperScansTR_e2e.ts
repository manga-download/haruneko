import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'reaperscanstr',
        title: 'Reaper Scans (Turkish)',
    },
    container: {
        url: 'https://reaperscans.com.tr/manga/a-gate-opened-on-my-first-day-as-a-politician/',
        id: '/manga/a-gate-opened-on-my-first-day-as-a-politician/',
        title: 'A Gate Opened on my First Day as a Politician',
        timeout: 15000

    },
    child: {
        id: '/a-gate-opened-on-my-first-day-as-a-politician-0-bolum/',
        title: 'Bölüm 0',
        timeout: 25000
    },
    entry: {
        index: 1,
        size: 2_501_299,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());