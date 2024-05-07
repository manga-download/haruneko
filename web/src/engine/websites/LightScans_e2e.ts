import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'lightscans',
        title: 'Light Scans'
    },
    container: {
        url: 'https://lightscans.fun/manga/i-need-to-raise-my-sister-properly/',
        id: '/manga/i-need-to-raise-my-sister-properly/',
        title: 'I Need to Raise My Sister Properly'
    },
    child: {
        id: '/i-need-to-raise-my-sister-properly-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 454_110,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());