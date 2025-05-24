import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'templescanesp',
        title: 'Temple Scan (ESP)'
    },
    container: {
        url: 'https://templescanesp.vxviral.xyz/serie/esponjoso/',
        id: '/serie/esponjoso/',
        title: 'Esponjoso'
    },
    child: {
        id: '/serie/esponjoso/capitulo-25/',
        title: 'Capitulo 25'
    },
    entry: {
        index: 1,
        size: 734_618,
        type: 'image/webp'
    }
}).AssertWebsite();