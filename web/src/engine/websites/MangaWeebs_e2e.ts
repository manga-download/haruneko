import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaweebs',
        title: 'Manga Weebs'
    },
    container: {
        url: 'https://mangaweebs.in/manga/magic-emperor/',
        id: JSON.stringify({ post: '2006', slug: '/manga/magic-emperor/' }),
        title: 'Magic Emperor'
    },
    child: {
        id: '/manga/magic-emperor/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 2,
        size: 74_064,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());