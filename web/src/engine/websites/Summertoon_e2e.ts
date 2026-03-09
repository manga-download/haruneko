import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'summertoon',
        title: 'Summertoon'
    },
    container: {
        url: 'https://summertoons.com/manga/i-cant-get-enough-of-you/',
        id: JSON.stringify({ post: '20', slug: '/manga/i-cant-get-enough-of-you/' }),
        title: 'I Can’t Get Enough of You'
    },
    child: {
        id: '/manga/i-cant-get-enough-of-you/bolum-46/',
        title: 'Bölüm 46'
    }, /* Need Login
    entry: {
        index: 12,
        size: 800_623,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();