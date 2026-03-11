import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwaclub',
        title: 'ManhwaClub'
    },
    container: {
        url: 'https://manhwaclub.org/manga/is-it-your-mother-or-sister/',
        id: JSON.stringify({ post: '2898', slug: '/manga/is-it-your-mother-or-sister/'}),
        title: 'Is It Your Mother or Sister?'
    },
    child: {
        id: '/manga/is-it-your-mother-or-sister/chapter-36/',
        title: 'Chapter 36'
    },
    entry: {
        index: 1,
        size: 603_893,
        type: 'image/jpeg'
    }
}).AssertWebsite();