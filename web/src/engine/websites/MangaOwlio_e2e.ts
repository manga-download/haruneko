import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaowlio',
        title: 'MangaOwl.io'
    },
    container: {
        url: 'https://mangaowl.io/manga/terminally-ill-genius-dark-knight/',
        id: JSON.stringify({ post: '4698', slug: '/manga/terminally-ill-genius-dark-knight/' }),
        title: 'Terminally-Ill Genius Dark Knight'
    },
    child: {
        id: '/manga/terminally-ill-genius-dark-knight/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 2,
        size: 1_085_668,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());