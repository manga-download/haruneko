import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'platinumscans',
        title: 'PlatinumScans'
    },
    container: {
        url: 'https://platinumscans.com/manga/i-am-the-heroic-knight-of-the-interstellar-nation/',
        id: JSON.stringify({ post: '346', slug: '/manga/i-am-the-heroic-knight-of-the-interstellar-nation/' }),
        title: 'I am the Heroic Knight of the Interstellar Nation'
    },
    child: {
        id: '/manga/i-am-the-heroic-knight-of-the-interstellar-nation/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 3,
        size: 577_193,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());