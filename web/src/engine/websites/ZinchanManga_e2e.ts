import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'zinchanmanga',
        title: 'Zinchan Manga'
    },
    container: {
        url: 'https://zinchangmanga.com/manga/savior-of-monday/',
        id: JSON.stringify({ post: '5003', slug: '/manga/savior-of-monday/' }),
        title: 'Savior of Monday'
    },
    child: {
        id: '/manga/savior-of-monday/chapter-28/',
        title: 'Chapter 28'
    },
    entry: {
        index: 0,
        size: 254_758,
        type: 'image/webp'
    }
}).AssertWebsite();