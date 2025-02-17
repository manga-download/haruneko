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
        id: '/tales-of-demons-and-gods/chapter-1-rebirth',
        title: 'Chapter 1: Rebirth'
    },
    entry: {
        index: 0,
        size: 129_583,
        type: 'image/jpeg'
    }
}).AssertWebsite();