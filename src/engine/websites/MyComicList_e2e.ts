import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mycomiclist',
        title: 'MyComicList'
    },
    container: {
        url: 'https://mycomiclist.org/comic/avengers-united-infinity-comic',
        id: '/comic/avengers-united-infinity-comic',
        title: 'Avengers United Infinity Comic'
    },
    child: {
        id: '/avengers-united-infinity-comic/issue-63/all',
        title: '#63'
    },
    entry: {
        index: 0,
        size: 384_838,
        type: 'image/jpeg'
    }
}).AssertWebsite();