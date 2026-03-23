import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lectorxd',
        title: 'LectorXD'
    },
    container: {
        url: 'https://lectorxd.com/manhwa/streaming-de-la-guia-oculta-del-retornado',
        id: '/manhwa/streaming-de-la-guia-oculta-del-retornado',
        title: 'Streaming de la guia oculta del retornado'
    },
    child: {
        id: '/manhwa/streaming-de-la-guia-oculta-del-retornado/leer/20',
        title: 'Capítulo 20'
    },
    entry: {
        index: 1,
        size: 89_570,
        type: 'image/webp'
    }
}).AssertWebsite();