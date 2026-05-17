import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hadesscans',
        title: 'Hades Scans',
    },
    container: {
        url: 'https://hadesscans.com/manga/akari-the-final-boss-girl-im-going-to-the-modern-age-to-find-someone-stronger-than-me/',
        id: '/manga/akari-the-final-boss-girl-im-going-to-the-modern-age-to-find-someone-stronger-than-me/',
        title: 'Akari the Final Boss Girl ~I’m Going to the Modern Age to Find Someone Stronger Than Me~'
    },
    child: {
        id: '/akari-the-final-boss-girl-im-going-to-the-modern-age-to-find-someone-stronger-than-me-chapter-84/',
        title: 'Chapter 84'
    },
    entry: {
        index: 0,
        size: 372_416,
        type: 'image/webp'
    }
}).AssertWebsite();