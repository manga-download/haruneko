import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'rio2manga',
        title: 'Rio2Manga'
    },
    container: {
        url: 'https://rio2manga.net/manga/occupy-the-monarch/',
        id: JSON.stringify({ post: '1428', slug: '/manga/occupy-the-monarch/' }),
        title: 'Occupy the Monarch'
    },
    child: {
        id: '/manga/occupy-the-monarch/chapter-16/',
        title: 'Chapter 16'
    },
    entry: {
        index: 0,
        size: 1_413_113,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());