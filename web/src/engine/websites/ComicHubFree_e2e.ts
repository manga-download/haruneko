import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mycomiclist',
        title: 'ComicHub Free'
    },
    container: {
        url: 'https://comichubfree.com/comic/avengers-united-infinity-comic',
        id: '/comic/avengers-united-infinity-comic',
        title: 'Avengers United Infinity Comic'
    },
    child: {
        id: '/avengers-united-infinity-comic/issue-1/all',
        title: 'Issue #1'
    },
    entry: {
        index: 0,
        size: 12_485,
        type: 'image/jpeg'
    }
}).AssertWebsite();