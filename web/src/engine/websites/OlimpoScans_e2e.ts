import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'olimposcans',
        title: 'OlimpoScans'
    },
    container: {
        url: 'https://leerolimpo.com/comic-la-venganza-del-sabueso-de-sangre-de-hierro.html',
        id: '/comic-la-venganza-del-sabueso-de-sangre-de-hierro.html',
        title: 'LA VENGANZA DEL SABUESO DE SANGRE DE HIERRO'
    },
    child: {
        id: '/leer-la-venganza-del-sabueso-de-sangre-de-hierro-capitulo-94.html',
        title: 'Capítulo 94',
    },
    entry: {
        index: 1,
        size: 225_908,
        type: 'image/webp'
    }
}).AssertWebsite();