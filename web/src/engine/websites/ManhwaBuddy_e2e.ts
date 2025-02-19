import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwabuddy',
        title: 'ManhwaBuddy'
    },
    container: {
        url: 'https://manhwabuddy.com/manhwa/hitomi-chan-is-shy-with-strangers/',
        id: '/manhwa/hitomi-chan-is-shy-with-strangers/',
        title: 'Hitomi-Chan Is Shy With Strangers'
    },
    child: {
        id: '/manhwa/hitomi-chan-is-shy-with-strangers/chapter-137/',
        title: 'Chapter 137'
    },
    entry: {
        index: 0,
        size: 782_947,
        type: 'image/jpeg'
    }
}).AssertWebsite();