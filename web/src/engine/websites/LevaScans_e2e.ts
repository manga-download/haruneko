import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'levascans',
        title: 'Leva Scans'
    },
    container: {
        url: 'https://levascans.com/manga/shadow-of-the-supreme/',
        id: '/manga/shadow-of-the-supreme/',
        title: 'Shadow of the Supreme'
    },
    child: {
        id: '/shadow-of-the-supreme-chapter-55/',
        title: 'Chapter 55'
    },
    entry: {
        index: 0,
        size: 1_449_298,
        type: 'image/webp',
    }
}).AssertWebsite();