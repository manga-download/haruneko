import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'summertoon',
        title: 'Summertoon'
    },
    container: {
        url: 'https://summertoons.org/manga/i-cant-get-enough-of-you/',
        id: '/manga/i-cant-get-enough-of-you/',
        title: 'I Can’t Get Enough of You',
        timeout: 10_000
    },
    child: {
        id: '/manga/i-cant-get-enough-of-you/bolum-46/',
        title: 'Bölüm 46'
    }, /* Need login
    entry: {
        index: 1,
        size: 236_162,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();