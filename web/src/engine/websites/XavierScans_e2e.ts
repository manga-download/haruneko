import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'xaviersscans',
        title: 'Xavier Scans'
    },
    container: {
        url: 'https://xavierscans.com/manga/the-descent-of-the-stars/',
        id: JSON.stringify({ post: '1983', slug: '/manga/the-descent-of-the-stars/' }),
        title: 'The Descent of the Stars'
    },
    child: {
        id: '/manga/the-descent-of-the-stars/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 596_512,
        type: 'image/jpeg'
    }
}).AssertWebsite();