import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manytoonkr',
        title: 'ManyToonKR'
    },
    container: {
        url: 'https://manytoon.club/manhwa-raw/fantasyland/',
        id: JSON.stringify({ post: '11119', slug: '/manhwa-raw/fantasyland/' }),
        title: 'Fantasyland'
    },
    child: {
        id: '/manhwa-raw/fantasyland/chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 248_416,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());