import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'zinchanmanga',
        title: 'Zinchan Manga'
    },
    container: {
        url: 'https://zinchangmanga.net/manga/savi-romanceor-of-monday/',
        id: JSON.stringify({ post: '7566', slug: '/manga/savi-romanceor-of-monday/' }),
        title: 'Savior of Monday'
    },
    child: {
        id: '/manga/savi-romanceor-of-monday/chapter-28/',
        title: 'Chapter 28'
    },
    entry: {
        index: 0,
        size: 254_758,
        type: 'image/webp'
    }
}).AssertWebsite();