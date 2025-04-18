import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangabuddy',
        title: 'MangaBuddy'
    },
    container: {
        url: 'https://mangabuddy.com/one-piece',
        id: '/one-piece',
        title: 'One Piece'
    },
    child: {
        id: '/one-piece/chapter-100-the-beginning-of-a-legend',
        title: 'Chapter 100 : The Beginning Of A Legend'
    },
    entry: {
        index: 0,
        size: 209_727,
        type: 'image/jpeg'
    }
}).AssertWebsite();