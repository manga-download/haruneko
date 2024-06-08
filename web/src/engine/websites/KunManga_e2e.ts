import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'kunmanga',
        title: 'KunManga'
    },
    container: {
        url: 'https://kunmanga.com/manga/a-ghostly-song/',
        id: JSON.stringify({ post: '25268', slug: '/manga/a-ghostly-song/' }),
        title: 'A Ghostly Song'
    },
    child: {
        id: '/manga/a-ghostly-song/chapter-4/',
        title: 'Chapter 4'
    },
    entry: {
        index: 0,
        size: 158_268,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());