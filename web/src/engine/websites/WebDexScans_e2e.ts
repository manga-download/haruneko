import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'webdexscans',
        title: 'WebDex Scans'
    },
    container: {
        url: 'https://webdexscans.com/series/steel-covenant/',
        id: JSON.stringify({ post: '2071', slug: '/series/steel-covenant/' }),
        title: 'Steel Covenant'
    },
    child: {
        id: '/series/steel-covenant/chapter-25/',
        title: 'Chapter 25'
    },
    entry: {
        index: 1,
        size: 719_170,
        type: 'image/webp'
    }
}).AssertWebsite();