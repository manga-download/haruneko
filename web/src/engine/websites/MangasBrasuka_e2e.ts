import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture( {
    plugin: {
        id: 'mangasbrasuka',
        title: 'Mangas Brasuka'
    },
    container: {
        url: 'https://mangasbrasuka.com.br/manga/yotaka-futatabi/',
        id: JSON.stringify({ post: '811', slug: '/manga/yotaka-futatabi/' }),
        title: 'Yotaka Futatabi'
    },
    child: {
        id: '/manga/yotaka-futatabi/capitulo-1_1/',
        title: 'Capitulo 1'
    },
    entry: {
        index: 1,
        size: 143_860,
        type: 'image/webp'
    }
}).AssertWebsite();