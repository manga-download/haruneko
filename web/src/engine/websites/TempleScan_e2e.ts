import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'templescan',
        title: 'TempleScan'
    },
    container: {
        url: 'https://templetoons.com/comic/in-the-garden-of-may',
        id: '/comic/in-the-garden-of-may',
        title: 'In The Garden of May'
    },
    child: {
        id: '/comic/in-the-garden-of-may/chapter-17',
        title: 'Chapter 17'
    },
    entry: {
        index: 6,
        size: 1_883_170,
        type: 'image/jpeg'
    }
}).AssertWebsite();