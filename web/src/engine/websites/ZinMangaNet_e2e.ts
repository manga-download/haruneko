import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'zinmanganet',
        title: 'ZinManga(.net)'
    },
    container: {
        url: 'https://www.zinmanga.net/manga/meet-in-the-middle',
        id: JSON.stringify({ post: '3914', slug: '/manga/meet-in-the-middle' }),
        title: 'Meet In The Middle'
    },
    child: {
        id: '/manga/meet-in-the-middle/chapter-50',
        title: 'Chapter 50'
    },
    entry: {
        index: 0,
        size: 779_490,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();