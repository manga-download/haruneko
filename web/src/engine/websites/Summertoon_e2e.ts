import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'summertoon',
        title: 'Summertoon'
    },
    container: {
        url: 'https://summertoons.tr/manga/i-cant-get-enough-of-you/',
        id: JSON.stringify({ post: '327', slug: '/manga/i-cant-get-enough-of-you/' }),
        title: 'I Can’t Get Enough of You'
    },
    child: {
        id: '/manga/i-cant-get-enough-of-you/i-cant-get-enough-of-you-bolum-46/',
        title: 'Bölüm 46'
    },
    entry: {
        index: 1,
        size: 236_162,
        type: 'image/jpeg'
    }
}).AssertWebsite();