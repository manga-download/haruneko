import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'resetscans',
        title: 'Reset Scans'
    },
    container: {
        url: 'https://resetscan.com/manga/scholar-return/',
        id: JSON.stringify({ post: '2055', slug: '/manga/scholar-return/' }),
        title: 'The Scholarly Reincarnation'
    },
    child: {
        id: '/manga/scholar-return/chapter-214',
        title: 'Chapter 214 - The End'
    },
    entry: {
        index: 0,
        size: 279_842,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());