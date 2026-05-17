import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'elrdrascans',
        title: 'Eldra Scans'
    },
    container: {
        url: 'https://eldrascans.com.tr/manga/return-of-the-devourer/',
        id: JSON.stringify({ post: '159', slug: '/manga/return-of-the-devourer/'}),
        title: 'Return of the Devourer'
    },
    child: {
        id: '/manga/return-of-the-devourer/chapter-18/',
        title: 'Chapter 18'
    },
    entry: {
        index: 0,
        size: 1_036_355,
        type: 'image/jpeg'
    }
}).AssertWebsite();