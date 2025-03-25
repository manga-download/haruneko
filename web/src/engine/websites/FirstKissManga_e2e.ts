import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'firstkissmanga',
        title: '1stKiss Manga (.org)'
    },
    container: {
        url: 'https://1stkissmanga.org/manga/i-want-to-do-bad-things-with-you/',
        id: JSON.stringify({ post: '37413', slug: '/manga/i-want-to-do-bad-things-with-you/' }),
        title: 'I Want To Do Bad Things With You'
    },
    child: {
        id: '/manga/i-want-to-do-bad-things-with-you/chapter-53/',
        title: 'Chapter 53'
    },
    entry: {
        index: 1,
        size: 28_924,
        type: 'image/webp'
    }
}).AssertWebsite();