import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangamirror',
        title: 'MangaMirror'
    },
    container: {
        url: 'https://mangamirror.com/manga/35631-debu-to-love-to-ayamachi-to',
        id: '/manga/35631-debu-to-love-to-ayamachi-to',
        title: 'Debu to Love to Ayamachi to!'
    },
    child: {
        id: '/manga/35631-debu-to-love-to-ayamachi-to/chapter-40',
        title: 'Chapter 40'
    },
    entry: {
        index: 0,
        size: 309_009,
        type: 'image/png'
    }
}).AssertWebsite();