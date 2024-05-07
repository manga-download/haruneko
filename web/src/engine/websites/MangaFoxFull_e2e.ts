import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangafoxfull',
        title: 'MangaFoxFull'
    },
    container: {
        url: 'https://mangafoxfull.com/manga/the-first-sword-of-earth/',
        id: JSON.stringify({ post: '6211', slug: '/manga/the-first-sword-of-earth/' }),
        title: 'The First Sword Of Earth'
    },
    child: {
        id: '/manga/the-first-sword-of-earth/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 977_794,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());