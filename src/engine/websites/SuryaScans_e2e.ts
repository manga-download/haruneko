import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'suryascans',
        title: 'Surya Scans'
    },
    container: {
        url: 'https://suryascans.org/manga/99-boss/',
        id: '/manga/99-boss/',
        title: '99 Boss'
    },
    child: {
        id: '/99-boss-chapter-1/',
        title: 'Chapter 1',
    },
    entry: {
        index: 0,
        size: 778_757,
        type: 'image/jpeg'
    }
}).AssertWebsite();