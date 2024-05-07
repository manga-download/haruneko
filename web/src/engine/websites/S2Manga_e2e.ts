import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 's2manga',
        title: 'S2Manga'
    },
    container: {
        url: 'https://www.s2manga.com/manga/the-villainous-moriarty-in-me/',
        id: JSON.stringify({ post: '76793', slug: '/manga/the-villainous-moriarty-in-me/' }),
        title: 'The Villainous Moriarty in Me'
    },
    child: {
        id: '/manga/the-villainous-moriarty-in-me/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 369_370,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());