import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: full slug
new TestFixture({
    plugin: {
        id: 'jeazscans',
        title: 'Jeaz Scans'
    },
    container: {
        url: 'https://lectorhub.j5z.xyz/manga/-si-la-hada-es-cruel-entonces-que-se-convierta-en-mi-caldero-de-cultivo-',
        id: '/manga/-si-la-hada-es-cruel-entonces-que-se-convierta-en-mi-caldero-de-cultivo-',
        title: '¡Si la hada es cruel, entonces que se convierta en mi caldero de cultivo!',
    },
    child: {
        id: '/leer/-si-la-hada-es-cruel-entonces-que-se-convierta-en-mi-caldero-de-cultivo-/capitulo-1',
        title: 'Capítulo 1',
        timeout: 10_000
    },
    entry: {
        index: 1,
        size: 1_103_866,
        type: 'image/webp'
    }
}).AssertWebsite();

// CASE: short slug (manga.php=1243)
new TestFixture({
    plugin: {
        id: 'jeazscans',
        title: 'Jeaz Scans',
    },
    container: {
        url: 'https://lectorhub.j5z.xyz/manga.php?id=164',
        id: '/manga.php?id=164',
        title: '¡Si la hada es cruel, entonces que se convierta en mi caldero de cultivo!'
    },
    child: {
        id: '/leer/-si-la-hada-es-cruel-entonces-que-se-convierta-en-mi-caldero-de-cultivo-/capitulo-1',
        title: 'Capítulo 1',
        timeout: 10_000
    },
    entry: {
        index: 1,
        size: 1_103_866,
        type: 'image/webp'
    }
}).AssertWebsite();