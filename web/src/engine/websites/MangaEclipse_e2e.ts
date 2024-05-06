import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaeclipse',
        title: 'Manga Eclipse'
    },
    container: {
        url: 'https://mangaeclipse.com/manga/the-dauntless-celestial-emperor/',
        id: JSON.stringify({ post: '2342', slug: '/manga/the-dauntless-celestial-emperor/' }),
        title: 'The Dauntless Celestial Emperor'
    },
    child: {
        id: '/manga/the-dauntless-celestial-emperor/chapter-10/',
        title: 'Chapter 10'
    },
    entry: {
        index: 0,
        size: 177_470,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());