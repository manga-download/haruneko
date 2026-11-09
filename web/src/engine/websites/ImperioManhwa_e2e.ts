import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'imperiomanhwa',
        title: 'Imperio Manhwa'
    },
    container: {
        url: 'https://imperiomanhwa.com/manga/3l-r3gr3s0-d3l-m4estro-d3l-inf1ern0/',
        id: '/manga/3l-r3gr3s0-d3l-m4estro-d3l-inf1ern0/',
        title: 'El Regreso del Maestro del Infierno'
    },
    child: {
        id: '/manga/3l-r3gr3s0-d3l-m4estro-d3l-inf1ern0/capitulo-1/',
        title: 'Capítulo 1',
        timeout: 20_000
    },
    entry: {
        index: 0,
        size: 179_252,
        type: 'image/jpeg'
    }
}).AssertWebsite();