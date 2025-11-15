import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'resetscans',
        title: 'Reset Scans'
    },
    container: {
        url: 'https://reset-scans.org/manga/stuck-in-the-tower/',
        id: JSON.stringify({ post: '162', slug: '/manga/stuck-in-the-tower/' }),
        title: 'Stuck in the Tower'
    },
    child: {
        id: '/manga/stuck-in-the-tower/chapter-91/',
        title: 'Chapter 91'
    },
    entry: {
        index: 0,
        size: 259_130,
        type: 'image/webp'
    }
}).AssertWebsite();