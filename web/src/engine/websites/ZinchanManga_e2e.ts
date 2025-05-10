import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'zinchanmanga',
        title: 'Zinchan Manga'
    },
    container: {
        url: 'https://zinchangmanga.com/manga/savior-of-monday-2/',
        id: JSON.stringify({ post: '5002', slug: '/manga/savior-of-monday-2/' }),
        title: 'Savior of Monday'
    },
    child: {
        id: '/manga/savior-of-monday-2/chapter-56/',
        title: 'Chapter 56'
    },
    entry: {
        index: 2,
        size: 93_258,
        type: 'image/jpeg'
    }
}).AssertWebsite();