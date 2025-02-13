import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatrnet',
        title: 'MangaTR (.Net)'
    },
    container: {
        url: 'https://mangatr.app/manga/king-of-the-mound',
        id: JSON.stringify({ post: '1804', slug: '/manga/king-of-the-mound' }),
        title: 'King of the Mound'
    },
    child: {
        id: '/manga/king-of-the-mound/bolum-59',
        title: 'Bölüm 59'
    },
    entry: {
        index: 0,
        size: 354_298,
        type: 'image/webp'
    }
}).AssertWebsite();