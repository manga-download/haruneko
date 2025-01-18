import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangabuddy',
        title: 'MangaBuddy'
    },
    container: {
        url: 'https://mangabuddy.com/this-world-is-mine',
        id: '/this-world-is-mine',
        title: 'This World is Mine'
    },
    child: {
        id: '/this-world-is-mine/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 187_647,
        type: 'image/jpeg'
    }
}).AssertWebsite();