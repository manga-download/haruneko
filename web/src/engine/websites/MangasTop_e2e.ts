import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangastop',
        title: 'Mangas Top',
    },
    container: {
        url: 'https://mangastop.net/obra/493084',
        id: '493084',
        title: 'A Batalha Através Dos Céus'
    },
    child: {
        id: '755083',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 456_260,
        type: 'image/webp'
    }
}).AssertWebsite();