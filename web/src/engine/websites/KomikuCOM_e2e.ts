import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'komikucom',
        title: 'Komiku.COM'
    },
    container: {
        url: 'https://01.komiku.asia/manga/my-wife-and-i-dominate-the-three-realms',
        id: '173650',
        title: 'My Wife and I Dominate the Three Realms'
    },
    child: {
        id: '173653',
        title: 'Chapter 1'
    },
    entry: {
        index: 5,
        size: 314_758,
        type: 'image/jpeg'
    }
}).AssertWebsite();