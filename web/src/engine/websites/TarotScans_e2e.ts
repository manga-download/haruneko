import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tarotscans',
        title: 'Tarot Scans'
    },
    container: {
        url: 'https://www.tarotscans.com/manga/the-genius-tamer-of-the-academy/',
        id: JSON.stringify({ post: '36643', slug: '/manga/the-genius-tamer-of-the-academy/'}),
        title: 'The Genius Tamer of the Academy'
    },
    child: {
        id: '/manga/the-genius-tamer-of-the-academy/chapter-26/',
        title: 'Chapter 26'
    },
    entry: {
        index: 0,
        size: 336_722,
        type: 'image/webp'
    }
}).AssertWebsite();