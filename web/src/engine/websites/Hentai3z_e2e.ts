import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hentai3z',
        title: 'Hentai3z'
    },
    container: {
        url: 'https://hentai3z.xyz/manga/secret-class-1016/',
        id: JSON.stringify({ post: '2662', slug: '/manga/secret-class-1016/' }),
        title: 'Secret Class'
    },
    child: {
        id: '/manga/secret-class-1016/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 41_812,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());