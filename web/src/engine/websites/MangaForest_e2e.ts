import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangaforest',
        title: 'MangaForest'
    },
    container: {
        url: 'https://mangaforest.me/tales-of-demons-and-gods',
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