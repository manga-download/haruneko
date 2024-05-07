import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'theblank',
        title: 'TheBlank'
    },
    container: {
        url: 'https://theblank.net/manga/booby-trap/',
        id: JSON.stringify({ post: '2657', slug: '/manga/booby-trap/' }),
        title: 'Booby Trap'
    },
    child: {
        id: '/manga/booby-trap/chapter-55/',
        title: 'Chapter 55'
    },
    entry: {
        index: 0,
        size: 943_952,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());