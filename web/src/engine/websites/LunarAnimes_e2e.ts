import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lunaranimes',
        title: 'Lunar Animes'
    },
    container: {
        url: 'https://lunaranime.ru/manga/who-made-me-a-princess-official',
        id: 'who-made-me-a-princess-official',
        title: 'Who Made Me a Princess (Official)'
    },
    child: {
        id: './who-made-me-a-princess-official/1?language=id',
        title: 'Chapter 1 (id)'
    },
    entry: {
        index: 0,
        size: 884_284,
        type: 'image/webp'
    }
}).AssertWebsite();