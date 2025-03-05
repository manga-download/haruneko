import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangagezgini',
        title: 'Manga Gezgini'
    },
    container: {
        url: 'https://mangagezgini.site/manga/limit-breaker/',
        id: JSON.stringify({ post: '873', slug: '/manga/limit-breaker/' }),
        title: 'Limit Breaker'
    },
    child: {
        id: '/manga/limit-breaker/limit-breaker-blm-79978c98a1f18c581632860ef90900709a/',
        title: 'Bölüm 79'
    },
    entry: {
        index: 1,
        size: 748_849,
        type: 'image/jpeg'
    }
}).AssertWebsite();