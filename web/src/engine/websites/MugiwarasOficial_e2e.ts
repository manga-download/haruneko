import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mugiwarasoficial',
        title: 'Mugiwaras Oficial'
    },
    container: {
        url: 'https://mugiwarasoficial.com/manga/the-apothecary-diaries/',
        id: JSON.stringify({ post: '7942', slug: '/manga/the-apothecary-diaries/' }),
        title: 'The Apothecary Diaries'
    },
    child: {
        id: '/manga/the-apothecary-diaries/chapter-1_-a-maldicao-do-harem/',
        title: 'Chapter 1_ A Maldição do Harém'
    },
    entry: {
        index: 2,
        size: 233_780,
        type: 'image/jpeg'
    }
}).AssertWebsite();