import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangagg',
        title: 'MangaGG'
    },
    container: {
        url: 'https://mangagg.com/comic/i-built-a-lifespan-club/',
        id: JSON.stringify({ post: '11243', slug: '/comic/i-built-a-lifespan-club/' }),
        title: 'I Built a Lifespan Club'
    },
    child: {
        id: '/comic/i-built-a-lifespan-club/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 291_106,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());