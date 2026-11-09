import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'uchuujinprojects',
        title: 'Uchuujin Projects'
    },
    container: {
        url: 'https://uchuujinmangas.com/manga/dejamelo-a-mi-y-sigue-tu/',
        id: '/manga/dejamelo-a-mi-y-sigue-tu/',
        title: '¡Déjamelo a mí y sigue tú!'
    },
    child: {
        id: '/dejamelo-capitulo-5/',
        title: 'Capítulo 5 - Capítulo 5',
    },
    entry: {
        index: 4,
        size: 629_328,
        type: 'image/webp'
    }
}).AssertWebsite();