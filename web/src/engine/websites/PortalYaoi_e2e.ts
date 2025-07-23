import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'portalyaoi',
        title: 'Portal Yaoi'
    },
    container: {
        url: 'https://lerboyslove.com/manga/love-shuttle/',
        id: JSON.stringify({ slug: '/manga/love-shuttle/' }),
        title: 'Love Shuttle'
    },
    child: {
        id: '/manga/love-shuttle/side-story-06/',
        title: 'Side Story 06'
    },
    entry: {
        index: 0,
        size: 272_635,
        type: 'image/jpeg'
    }
}).AssertWebsite();