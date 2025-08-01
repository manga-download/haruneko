import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwaread',
        title: 'ManhwaRead',
    },
    container: {
        url: 'https://manhwaread.com/manhwa/royal-family/',
        id: '/manhwa/royal-family/',
        title: 'Royal Family'
    },
    child: {
        id: '/manhwa/royal-family/chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 0,
        size: 402_979,
        type: 'image/jpeg'
    }
}).AssertWebsite();