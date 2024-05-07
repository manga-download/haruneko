import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuaus',
        title: 'Manhua Us'
    },
    container: {
        url: 'https://manhuaus.com/manga/beware-of-obsession/',
        id: JSON.stringify({ post: '1356687', slug: '/manga/beware-of-obsession/' }),
        title: 'Beware of Obsession'
    },
    child: {
        id: '/manga/beware-of-obsession/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 241_696,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());