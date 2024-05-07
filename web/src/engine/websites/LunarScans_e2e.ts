import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lunarscans',
        title: 'Lunar Scans'
    },
    container: {
        url: 'https://lunarscan.org/series/thats-not-how-you-do-it/',
        id: '/series/thats-not-how-you-do-it/',
        title: 'That’s Not How You Do It'
    },
    child: {
        id: '/thats-not-how-you-do-it-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 4_651_490,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());