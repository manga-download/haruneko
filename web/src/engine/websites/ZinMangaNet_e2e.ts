import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'zinmanganet',
        title: 'ZinManga(.net)'
    },
    container: {
        url: 'https://www.zinmanga.net/manga/meet-in-the-middle',
        id: JSON.stringify({ slug: '/manga/meet-in-the-middle' }),
        title: 'Meet in The Middle'
    },
    child: {
        id: '/manga/meet-in-the-middle/chapter-127',
        title: 'Chapter 127'
    },
    entry: {
        index: 0,
        size: 37_056,
        type: 'image/webp'
    }
}).AssertWebsite();