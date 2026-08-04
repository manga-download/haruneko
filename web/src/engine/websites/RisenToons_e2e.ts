import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'risentoons',
        title: 'RisenToons'
    },
    container: {
        url: 'https://risentoons.xyz/biblioteca/eu-dominei-a-academia-com-uma-unica-faca-de-sashimi',
        id: '3ae0a1a6-9f6a-496d-bf64-ae4dd33b7204',
        title: 'Eu Dominei a Academia Com uma Única Faca de Sashimi'
    },
    child: {
        id: 'ch_6nMZAnCrxZX5ZOEOzPZC5m',
        title: 'Capítulo 0'
    },
    entry: {
        index: 0,
        size: 10_444,
        type: 'image/webp'
    }
}).AssertWebsite();