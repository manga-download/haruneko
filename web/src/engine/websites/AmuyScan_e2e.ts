import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'amuyscan',
        title: 'AmuyScan'
    },
    container: {
        url: 'https://www.apenasmaisumyaoi.com/manga/200/',
        id: JSON.stringify({ post: '200', slug: '/manga/200/' }),
        title: 'Até Logo, Meu Rei'
    },
    child: {
        id: '/manga/200/1a-temporada/capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 599_582,
        type: 'image/webp'
    }
}).AssertWebsite();