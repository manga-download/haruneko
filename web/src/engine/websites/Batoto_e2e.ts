/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Invariant Locale
new TestFixture({
    plugin: {
        id: 'batoto',
        title: 'Batoto (by AnyACG)'
    },
    container: {
        url: 'https://xbato.org/series/173640/villainesses-have-more-fun',
        id: '/series/173640/villainesses-have-more-fun',
        title: 'Villainesses Have More Fun'
    },
    child: {
        id: '/chapter/3116336',
        title: 'Chapter 101'
    },
    entry: {
        index: 2,
        size: 882_364,
        type: 'image/webp'
    }
}).AssertWebsite();

// CASE: Hungarian Locale
new TestFixture({
    plugin: {
        id: 'batoto',
        title: 'Batoto (by AnyACG)'
    },
    container: {
        url: 'https://xbato.org/series/102127/wind-breaker',
        id: '/series/102127/wind-breaker',
        title: 'Wind Breaker [hu]'
    },
    child: {
        id: '/chapter/1901476',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 62_432,
        type: 'image/webp'
    }
}).AssertWebsite();
*/