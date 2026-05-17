import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangakio',
        title: 'MangaKio'
    },
    container: {
        url: 'https://mangak.io/tales-of-demons-and-gods',
        id: '/tales-of-demons-and-gods',
        title: 'Tales Of Demons And Gods'
    },
    child: {
        id: '/tales-of-demons-and-gods/chapter-50',
        title: 'Chapter 50'
    },
    entry: {
        index: 1,
        size: 135_362,
        type: 'image/jpeg'
    }
}).AssertWebsite();