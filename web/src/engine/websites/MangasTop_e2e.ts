import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangastop',
        title: 'Mangas Top',
    },
    container: {
        url: 'https://mangastop.net/manga/a-batalha-atraves-dos-ceus/',
        id: '/manga/a-batalha-atraves-dos-ceus/',
        title: 'A Batalha Através Dos Céus'
    },
    child: {
        id: '/batalha-atraves-dos-ceus-capitulo-01/',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 456_260,
        type: 'image/webp'
    }
}).AssertWebsite();