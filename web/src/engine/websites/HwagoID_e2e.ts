import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hwagoid',
        title: 'Hwago'
    },
    container: {
        url: 'https://01.hwago.com/comic/dreaming-freedom',
        id: '/comic/dreaming-freedom',
        title: 'Dreaming Freedom'
    },
    child: {
        id: '/read/dreaming-freedom/chapter-126',
        title: 'Chapter 126'
    },
    entry: {
        index: 1,
        size: 104_080,
        type: 'image/webp'
    }
}).AssertWebsite();