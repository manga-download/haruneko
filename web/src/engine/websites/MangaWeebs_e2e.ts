import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangaweebs',
        title: 'Manga Weebs'
    },
    container: {
        url: 'https://mangaweebs.org/manga/demon-magic-emperor/',
        id: JSON.stringify({ post: '2006', slug: '/manga/demon-magic-emperor/' }),
        title: 'Demon Magic Emperor'
    },
    child: {
        id: '/manga/demon-magic-emperor/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 34_016,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());