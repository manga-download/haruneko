import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
        id: '/avengers-united-infinity-comic/issue-45/all',
        title: '#45'
    },
    entry: {
        index: 0,
        size: 299_036,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();