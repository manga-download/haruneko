import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'portalyaoi',
        title: 'Portal Yaoi'
    },
    container: {
        url: 'https://portalyaoi.com/manga/love-shuttle/',
        id: JSON.stringify({ post: '14', slug: '/manga/love-shuttle/' }),
        title: 'Love Shuttle'
    },
    child: {
        id: '/manga/love-shuttle/side-story-06/',
        title: 'Side Story 06'
    },
    entry: {
        index: 0,
        size: 878_576,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());