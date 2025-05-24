import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhuabuddy',
        title: 'Manhua Buddy',
    },
    container: {
        url: 'https://manhuabuddy.com/manhwa/playing-the-perfect-fox-eyed-villain',
        id: '/manhwa/playing-the-perfect-fox-eyed-villain',
        title: 'Playing the Perfect Fox-Eyed Villain'
    },
    child: {
        id: '/manhwa/playing-the-perfect-fox-eyed-villain/chapter-14-ch264161',
        title: 'Chapter 14'
    },
    entry: {
        index: 0,
        size: 147_291,
        type: 'image/jpeg'
    }
}).AssertWebsite();