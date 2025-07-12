import { TestFixture } from '../../../test/WebsitesFixture';

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
        title: 'Cápitulo 01'
    },
    entry: {
        index: 0,
        size: 164_168,
        type: 'image/webp'
    }
}).AssertWebsite();