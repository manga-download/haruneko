import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nightscans',
        title: 'NightScans'
    },
    container: {
        url: 'https://night-scans.com/series/all-football-talents-are-mine/',
        id: '/series/all-football-talents-are-mine/',
        title: 'All Football Talents Are Mine'
    },
    child: {
        id: '/all-football-talents-are-mine-chapter-20/',
        title: 'Chapter 20'
    },
    entry: {
        index: 1,
        size: 223_172,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());