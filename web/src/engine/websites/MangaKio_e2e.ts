import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangakio',
        title: 'MangaKio'
    },
    container: {
        url: 'https://mangak.io/tales-of-demons-and-gods',
        id: 'jD69GxYM',
        title: 'Tales Of Demons And Gods'
    },
    child: {
        id: 'LDgxQ7l2',
        title: 'Chapter 50'
    },
    entry: {
        index: 1,
        size: 95_168,
        type: 'image/webp'
    }
}).AssertWebsite();