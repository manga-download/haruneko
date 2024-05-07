import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangarocky',
        title: 'Manga Rocky'
    },
    container: {
        url: 'https://mangarocky.com/manga/kanojo-okarishimasu/',
        id: JSON.stringify({ post: '2798', slug: '/manga/kanojo-okarishimasu/' }),
        title: 'Kanojo, Okarishimasu'
    },
    child: {
        id: '/manga/kanojo-okarishimasu/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 182_422,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());