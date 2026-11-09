import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: full slug
new TestFixture({
    plugin: {
        id: 'jeazscans',
        title: 'Jeaz Scans'
    },
    container: {
        url: 'https://lectorhub.j5z.xyz/manga/despues-de-dejar-de-actuar-como-un-perro-me-converti-en-un-magnate-celestial-urbano',
        id: '/manga/despues-de-dejar-de-actuar-como-un-perro-me-converti-en-un-magnate-celestial-urbano',
        title: 'Después de dejar de actuar como un perro, me convertí en un Magnate Celestial Urbano',
    },
    child: {
        id: '/leer/despues-de-dejar-de-actuar-como-un-perro-me-converti-en-un-magnate-celestial-urbano/capitulo-10',
        title: 'Capítulo 10',
    },
    entry: {
        index: 1,
        size: 309_205,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: short slug (manga.php=1243)
new TestFixture({
    plugin: {
        id: 'jeazscans',
        title: 'Jeaz Scans',
    },
    container: {
        url: 'https://lectorhub.j5z.xyz/manga.php?id=284',
        id: '/manga.php?id=284',
        title: 'Después de dejar de actuar como un perro, me convertí en un Magnate Celestial Urbano',
    },
    child: {
        id: '/leer/despues-de-dejar-de-actuar-como-un-perro-me-converti-en-un-magnate-celestial-urbano/capitulo-10',
        title: 'Capítulo 10',
    },
    entry: {
        index: 1,
        size: 309_205,
        type: 'image/jpeg'
    }
}).AssertWebsite();