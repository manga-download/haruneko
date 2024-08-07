import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hiperdex',
        title: 'Hiperdex'
    },
    container: {
        url: 'https://hiperdex.top/manga/b-chiku/',
        id: JSON.stringify({ post: '2529', slug: '/manga/b-chiku/' }),
        title: 'B-Chiku'
    },
    child: {
        id: '/manga/b-chiku/07-end/',
        title: '07 [END]'
    },
    entry: {
        index: 0,
        size: 183_996,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
