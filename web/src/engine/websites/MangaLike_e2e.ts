import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangalike',
        title: 'MangaLike'
    },
    container: {
        url: 'https://manga-like.org/manhwa/it-all-starts-with-a-group-of-primitive-people/',
        id: JSON.stringify({ post: '74711', slug: '/manhwa/it-all-starts-with-a-group-of-primitive-people/' }),
        title: 'it all starts with a group of primitive people'
    },
    child: {
        id: '/manhwa/it-all-starts-with-a-group-of-primitive-people/45/',
        title: '45'
    },
    entry: {
        index: 0,
        size: 391_862,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());