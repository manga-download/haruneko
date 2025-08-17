import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'komikucom',
        title: 'Komiku.COM'
    },
    container: {
        url: 'https://01.komiku.asia/manga/my-wife-and-i-dominate-the-three-realms/',
        id: '/manga/my-wife-and-i-dominate-the-three-realms/',
        title: 'My Wife and I Dominate the Three Realms'
    },
    child: {
        id: '/my-wife-and-i-dominate-the-three-realms-chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 21_669,
        type: 'image/jpeg'
    }
}).AssertWebsite();