import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangalector',
        title: 'MangaLector'
    },
    container: {
        url: 'https://mangalector.com/manga/jinx-2022',
        id: JSON.stringify({ post: '11865', slug: '/manga/jinx-2022' }),
        title: 'Jinx  (2022)'
    },
    child: {
        id: '/jinx-2022-capitulo-101',
        title: 'Capítulo 101'
    },
    entry: {
        index: 1,
        size: 1_570_941,
        type: 'image/jpeg'
    }
}).AssertWebsite();