import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'summertoon',
        title: 'Summertoon'
    },
    container: {
        url: 'https://summertoon.co/manga/i-cant-get-enough-of-you/',
        id: '/manga/i-cant-get-enough-of-you/',
        title: 'I Can’t Get Enough of You'
    },
    child: {
        id: '/i-cant-get-enough-of-you-bolum-46/',
        title: 'Bölüm 46'
    },
    entry: {
        index: 12,
        size: 800_623,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();