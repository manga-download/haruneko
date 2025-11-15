import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manytooncom',
        title: 'ManyToon'
    },
    container: {
        url: 'https://manytoon.com/comic/boarding-school/',
        id: JSON.stringify({ post: '222638', slug: '/comic/boarding-school/' }),
        title: 'Boarding School'
    },
    child: {
        id: '/comic/boarding-school/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 898_037,
        type: 'image/jpeg'
    }
}).AssertWebsite();