import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'templescanesp',
        title: 'Temple Scan (ESP)'
    },
    container: {
        url: 'https://templescanesp.caserosvive.com.ar/ver/temblor-esencial',
        id: '/ver/temblor-esencial?allow=true',
        title: 'Temblor Esencial'
    },
    child: {
        id: '/ver/temblor-esencial/capitulo-22?allow=true',
        title: 'Capítulo 22'
    },
    entry: {
        index: 0,
        size: 1_619_278,
        type: 'image/webp'
    }
}).AssertWebsite();