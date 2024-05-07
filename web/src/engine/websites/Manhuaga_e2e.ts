import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuaga',
        title: 'Manhuaga'
    },
    container: {
        url: 'https://manhuaga.com/manga/keep-a-low-profile-sect-leader/',
        id: JSON.stringify({ post: '2373', slug: '/manga/keep-a-low-profile-sect-leader/' }),
        title: 'Keep A Low Profile, Sect Leader'
    },
    child: {
        id: '/manga/keep-a-low-profile-sect-leader/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 2,
        size: 699_120,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());