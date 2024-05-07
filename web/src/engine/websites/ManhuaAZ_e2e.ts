import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuaaz',
        title: 'ManhuaAZ'
    },
    container: {
        url: 'https://manhuaaz.com/manga/the-secret-of-the-partner-next-to-you/',
        id: JSON.stringify({ post: '39812', slug: '/manga/the-secret-of-the-partner-next-to-you/' }),
        title: 'The Secret Of The Partner Next To You'
    },
    child: {
        id: '/manga/the-secret-of-the-partner-next-to-you/chapter-1/',
        title: 'chapter 1'
    },
    entry: {
        index: 1,
        size: 223_573,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());