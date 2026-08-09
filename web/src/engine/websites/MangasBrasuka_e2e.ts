import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangasbrasuka',
        title: 'Mangas Brasuka'
    },
    container: {
        url: 'https://mangasbrasuka.com.br/manga/yotaka-futatabi',
        id: '/manga/yotaka-futatabi',
        title: 'Yotaka Futatabi'
    },
    child: {
        id: '/manga/yotaka-futatabi/ler/1',
        title: 'Capítulo 1'
    },
    entry: {
        index: 1,
        size: 201_666,
        type: 'image/webp'
    }
}).AssertWebsite();