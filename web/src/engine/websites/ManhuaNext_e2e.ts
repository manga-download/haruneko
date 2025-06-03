import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhuanext',
        title: 'ManhuaNext'
    },
    container: {
        url: 'https://manhuanext.com/manga/the-villain-wants-to-live-one-more-day/',
        id: JSON.stringify({ post: '89', slug: '/manga/the-villain-wants-to-live-one-more-day/' }),
        title: 'The Villain Wants to Live One More Day'
    },
    child: {
        id: '/manga/the-villain-wants-to-live-one-more-day/chapter-33/',
        title: 'Chapter 33'
    },
    entry: {
        index: 0,
        size: 966_724,
        type: 'image/webp'
    }
}).AssertWebsite();