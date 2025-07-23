import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'erosscans',
        title: 'Eros Scans'
    },
    container: {
        url: 'https://erosvoids.xyz/manga/absolute-sword-sense/',
        id: '/manga/absolute-sword-sense/',
        title: 'Absolute Sword Sense'
    },
    child: {
        id: '/absolute-sword-sense-chapter-92-3/',
        title: 'Chapter 92'
    },
    entry: {
        index: 0,
        size: 832_576,
        type: 'image/webp'
    }
}).AssertWebsite();