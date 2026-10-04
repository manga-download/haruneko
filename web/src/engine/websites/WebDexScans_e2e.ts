import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'webdexscans',
        title: 'WebDex Scans'
    },
    container: {
        url: 'https://webdexscans.com/series/steel-covenant21',
        id: '/series/steel-covenant21',
        title: 'Steel Covenant'
    },
    child: {
        id: '/series/steel-covenant21/chapter-25',
        title: 'Chapter 25'
    },
    entry: {
        index: 1,
        size: 719_170,
        type: 'image/webp'
    }
}).AssertWebsite();