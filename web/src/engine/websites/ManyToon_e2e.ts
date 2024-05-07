import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manytoon',
        title: 'ManyToon(.me)',
        timeout: 30000
    },
    container: {
        url: 'https://manytoon.me/manhwa/fantasyland/',
        id: JSON.stringify({ post: '65382', slug: '/manhwa/fantasyland/' }),
        title: 'Fantasyland'
    },
    child: {
        id: '/manhwa/fantasyland/chapter-01/',
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