import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lectormangalat',
        title: 'LectorManga (.Lat)'
    },
    container: {
        url: 'https://lectormangass.net/comics/linea-de-corte',
        id: '/comics/linea-de-corte',
        title: 'Linea De Corte'
    },
    child: {
        id: '/comics/linea-de-corte/capitulo-107',
        title: 'Capítulo 107'
    },
    entry: {
        index: 0,
        size: 121_098,
        type: 'image/webp'
    }
}).AssertWebsite();