import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'amuyscan',
        title: 'AmuyScan'
    },
    container: {
        url: 'https://apenasmaisumyaoi.com/home/manga/200/',
        id: JSON.stringify({ post: '200', slug: '/home/manga/200/' }),
        title: 'Até Logo, Meu Rei'
    },
    child: {
        id: '/home/manga/200/1a-temporada/capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 599_582,
        type: 'image/webp'
    }
}).AssertWebsite();