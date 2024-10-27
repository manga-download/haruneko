import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manytooncom',
        title: 'ManyToon'
    },
    container: {
        url: 'https://manytoon.org/comic/boarding-school/',
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
};

new TestFixture(config).AssertWebsite();