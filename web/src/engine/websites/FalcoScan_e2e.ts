import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Normal
new TestFixture({
    plugin: {
        id: 'tenkai',
        title: 'Falco Scan'
    },
    container: {
        url: 'https://falcoscan.net/comics/cafeina',
        id: '/comics/cafeina',
        title: 'Cafeina'
    },
    child: {
        id: '/comics/cafeina/capitulo-01',
        title: 'Capítulo 01'
    },
    entry: {
        index: 0,
        size: 164_168,
        type: 'image/webp'
    }
}).AssertWebsite();

// CASE: Scrambled
new TestFixture({
    plugin: {
        id: 'tenkai',
        title: 'Falco Scan'
    },
    container: {
        url: 'https://falcoscan.net/comics/amorenventa',
        id: '/comics/amorenventa',
        title: 'Amor en Venta'
    },
    child: {
        id: '/comics/amorenventa/capitulo-17',
        title: 'Capítulo 17'
    },
    entry: {
        index: 0,
        size: 6_866_325,
        type: 'image/png'
    }
}).AssertWebsite();