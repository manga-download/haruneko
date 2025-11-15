import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwaclub',
        title: 'ManhwaClub'
    },
    container: {
        url: 'https://manhwaclub.net/manga/is-it-your-mother-or-sister-04/',
        id: JSON.stringify({ post: '20873', slug: '/manga/is-it-your-mother-or-sister-04/'}),
        title: 'Is It Your Mother or Sister?'
    },
    child: {
        id: '/manga/is-it-your-mother-or-sister-04/chapter-36/',
        title: 'Chapter 36'
    },
    entry: {
        index: 1,
        size: 396_450,
        type: 'image/jpeg'
    }
}).AssertWebsite();