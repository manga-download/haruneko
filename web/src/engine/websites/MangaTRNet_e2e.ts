import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatrnet',
        title: 'MangaTR (.Net)'
    },
    container: {
        url: 'https://mangatr.io/manga/king-of-the-mound/',
        id: JSON.stringify({ slug: '/manga/king-of-the-mound/'}),
        title: 'King Of The Mound'
    },
    child: {
        id: '/manga/king-of-the-mound/bolum-59/',
        title: 'Bölüm 59'
    },
    entry: {
        index: 0,
        size: 354_298,
        type: 'image/webp'
    }
}).AssertWebsite();