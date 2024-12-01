import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'foyscan',
        title: 'FoyScan'
    },
    container: {
        url: 'https://foyscan.xyz/serie/juego-del-rey',
        id: '/serie/juego-del-rey',
        title: 'Juego del Rey'
    },
    child: {
        id: '/serie/juego-del-rey/capitulo-43',
        title: 'Capítulo 43'
    },
    entry: {
        index: 0,
        size: 590_342,
        type: 'image/jpeg'
    }
}).AssertWebsite();