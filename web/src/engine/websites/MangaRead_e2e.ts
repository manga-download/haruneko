/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaread',
        title: 'MangaRead'
    },
    container: {
        url: 'https://www.mangaread.org/manga/maou-sama-retry-r/',
        id: JSON.stringify({ post: '87650', slug: '/manga/maou-sama-retry-r/' }),
        title: 'Maou-Sama, Retry! R'
    },
    child: {
        id: '/manga/maou-sama-retry-r/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 123_364,
        type: 'image/jpeg'
    }
}).AssertWebsite();
*/