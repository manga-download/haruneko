import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaaction',
        title: 'Manga Action'
    },
    container: {
        url: 'https://mangaaction.com/manga/leveling-with-the-gods/',
        id: JSON.stringify({ post: '1111', slug: '/manga/leveling-with-the-gods/' }),
        title: 'Leveling With The Gods'
    },
    child: {
        id: '/manga/leveling-with-the-gods/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 81_072,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());