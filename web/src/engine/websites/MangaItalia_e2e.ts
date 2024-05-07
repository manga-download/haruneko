import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manga-italia',
        title: 'Manga Italia'
    },
    container: {
        url: 'https://manga-italia.com/manga/4-cut-hero',
        id: '/manga/4-cut-hero',
        title: '4 Cut Hero'
    },
    child: {
        id: '/book/26099',
        title: 'Capitolo 52'
    },
    entry: {
        index: 1,
        size: 31_568,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());