import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangasushi',
        title: 'Mangasushi'
    },
    container: {
        url: 'https://mangasushi.org/manga/lonely-attack-on-the-different-world/',
        id: JSON.stringify({ post: '1909', slug: '/manga/lonely-attack-on-the-different-world/' }),
        title: 'Lonely Attack on the Different World'
    },
    child: {
        id: '/manga/lonely-attack-on-the-different-world/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 2_332_355,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());