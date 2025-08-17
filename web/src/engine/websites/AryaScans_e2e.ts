import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'aryascans',
        title: 'Arya Scans'
    },
    container: {
        url: 'https://aryascans.com/manga/god-slayer/',
        id: JSON.stringify({ post: '2048', slug: '/manga/god-slayer/' }),
        title: 'God Slayer'
    },
    child: {
        id: '/manga/god-slayer/chapter-0/',
        title: 'Chapter 0'
    },
    entry: {
        index: 2,
        size: 410_353,
        type: 'image/jpeg'
    }
}).AssertWebsite();