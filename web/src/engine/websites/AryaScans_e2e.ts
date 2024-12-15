import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
        index: 0,
        size: 665_527,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();