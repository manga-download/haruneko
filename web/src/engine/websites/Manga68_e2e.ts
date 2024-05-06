import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manga68',
        title: 'Manga68'
    },
    container: {
        url: 'https://manga68.com/manga/the-beginning-after-the-end/',
        id: JSON.stringify({ post: '1905', slug: '/manga/the-beginning-after-the-end/' }),
        title: 'The Beginning After The End'
    },
    child: {
        id: '/manga/the-beginning-after-the-end/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 1_932_519,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());